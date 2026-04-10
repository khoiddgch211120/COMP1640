package com.example.comp1640.service.impl;

import com.example.comp1640.entity.AcademicYear;
import com.example.comp1640.entity.Comment;
import com.example.comp1640.entity.Document;
import com.example.comp1640.entity.Idea;
import com.example.comp1640.exception.BadRequestException;
import com.example.comp1640.repository.AcademicYearRepository;
import com.example.comp1640.repository.CommentRepository;
import com.example.comp1640.repository.DocumentRepository;
import com.example.comp1640.repository.IdeaRepository;
import com.example.comp1640.service.ExportService;
import com.opencsv.CSVWriter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.net.URI;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
@Transactional(readOnly = true)
public class ExportServiceImpl implements ExportService {

   private static final Logger logger = LoggerFactory.getLogger(ExportServiceImpl.class);

   private final IdeaRepository ideaRepository;
   private final CommentRepository commentRepository;
   private final DocumentRepository documentRepository;
   private final AcademicYearRepository academicYearRepository;

   public ExportServiceImpl(IdeaRepository ideaRepository, CommentRepository commentRepository,
         DocumentRepository documentRepository, AcademicYearRepository academicYearRepository) {
      this.ideaRepository = ideaRepository;
      this.commentRepository = commentRepository;
      this.documentRepository = documentRepository;
      this.academicYearRepository = academicYearRepository;
   }

   private void checkFinalClosure(Integer yearId) {
      AcademicYear year = academicYearRepository.findById(yearId)
            .orElseThrow(() -> new BadRequestException("Năm học không tồn tại: " + yearId));
      if (LocalDate.now().isBefore(year.getFinalClosureDate())) {
         throw new BadRequestException("Chưa đến ngày đóng cuối (final_closure_date). Không thể xuất dữ liệu.");
      }
   }

   @Override
   public void exportIdeasAndCommentsToCSV(Integer yearId, HttpServletResponse response) {
      checkFinalClosure(yearId);
      try {
         // Set response headers
         response.setContentType("text/csv;charset=UTF-8");
         response.setHeader("Content-Disposition", "attachment;filename=ideas_comments_" + yearId + ".csv");
         response.setCharacterEncoding("UTF-8");

         // Get all ideas for the year
         List<Idea> ideas = ideaRepository.findByAcademicYear_YearId(yearId);

         // Create CSV writer with UTF-8 BOM to handle Vietnamese characters
         OutputStreamWriter outputStreamWriter = new OutputStreamWriter(
               response.getOutputStream(), StandardCharsets.UTF_8);
         // Write BOM for Excel UTF-8 support
         outputStreamWriter.write('\ufeff');
         outputStreamWriter.flush();

         CSVWriter csvWriter = new CSVWriter(outputStreamWriter);

         // Write header
         String[] header = { "Loại", "ID", "Tiêu đề/Nội dung", "Tác giả", "Ẩn danh", "Phòng ban", "Ngày tạo" };
         csvWriter.writeNext(header);

         // Write ideas
         for (Idea idea : ideas) {
            String[] ideaRow = {
                  "Ý tưởng",
                  String.valueOf(idea.getIdeaId()),
                  idea.getTitle(),
                  idea.getIsAnonymous() ? "Ẩn danh"
                        : (idea.getUser() != null ? idea.getUser().getFullName() : "Unknown"),
                  idea.getIsAnonymous() ? "Có" : "Không",
                  idea.getDepartment() != null ? idea.getDepartment().getDeptName() : "N/A",
                  idea.getSubmittedAt().toString()
            };
            csvWriter.writeNext(ideaRow);

            // Write comments for this idea
            List<Comment> comments = commentRepository.findByIdeaIdeaIdOrderByCreatedAtAsc(idea.getIdeaId());
            for (Comment comment : comments) {
               String[] commentRow = {
                     "  └─ Bình luận",
                     String.valueOf(comment.getCommentId()),
                     comment.getContent(),
                     comment.getIsAnonymous() ? "Ẩn danh"
                           : (comment.getUser() != null ? comment.getUser().getFullName() : "Unknown"),
                     comment.getIsAnonymous() ? "Có" : "Không",
                     idea.getDepartment() != null ? idea.getDepartment().getDeptName() : "N/A",
                     comment.getCreatedAt().toString()
               };
               csvWriter.writeNext(commentRow);
            }
         }

         csvWriter.close();
      } catch (IOException e) {
         throw new RuntimeException("Error exporting CSV: " + e.getMessage(), e);
      }
   }

   @Override
   public void exportAttachmentsAsZip(Integer yearId, HttpServletResponse response) {
      checkFinalClosure(yearId);
      try {
         // Set response headers
         response.setContentType("application/zip");
         response.setHeader("Content-Disposition", "attachment;filename=attachments_" + yearId + ".zip");

         // Get all ideas for the year
         List<Idea> ideas = ideaRepository.findByAcademicYear_YearId(yearId);

         ZipOutputStream zos = new ZipOutputStream(response.getOutputStream());

         // Add documents to ZIP
         for (Idea idea : ideas) {
            List<Document> documents = documentRepository.findByIdeaIdeaId(idea.getIdeaId());

            for (Document doc : documents) {
               try {
                  // Create folder structure: /IdeaID/filename
                  String folderPath = "Idea_" + idea.getIdeaId() + "_"
                        + idea.getTitle().replaceAll("[^a-zA-Z0-9._-]", "_") + "/";
                  String entryPath = folderPath + doc.getFileName();

                  ZipEntry zipEntry = new ZipEntry(entryPath);
                  zos.putNextEntry(zipEntry);

                  // Download file from URL and write to ZIP
                  downloadFileToZip(doc.getFileUrl(), zos);

                  zos.closeEntry();
               } catch (Exception e) {
                  logger.warn("Error adding document to ZIP: {} - {}", doc.getFileName(), e.getMessage(), e);
                  // Continue processing other documents
               }
            }
         }

         zos.close();
      } catch (IOException e) {
         throw new RuntimeException("Error exporting ZIP: " + e.getMessage(), e);
      }
   }

   private static final List<String> ALLOWED_HOSTS = List.of("res.cloudinary.com", "cloudinary.com");

   private void downloadFileToZip(String fileUrl, ZipOutputStream zos) throws Exception {
      URI uri = new URI(fileUrl);
      String host = uri.getHost();
      if (host == null || ALLOWED_HOSTS.stream().noneMatch(host::endsWith)) {
         throw new SecurityException("File URL host is not allowed: " + host);
      }
      URLConnection connection = uri.toURL().openConnection();
      connection.setConnectTimeout(5000);
      connection.setReadTimeout(5000);

      try (InputStream inputStream = connection.getInputStream()) {
         byte[] buffer = new byte[1024];
         int bytesRead;
         while ((bytesRead = inputStream.read(buffer)) != -1) {
            zos.write(buffer, 0, bytesRead);
         }
      }
   }
}
