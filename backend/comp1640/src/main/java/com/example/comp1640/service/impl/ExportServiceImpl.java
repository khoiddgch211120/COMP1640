package com.example.comp1640.service.impl;

import com.example.comp1640.entity.Comment;
import com.example.comp1640.entity.Document;
import com.example.comp1640.entity.Idea;
import com.example.comp1640.repository.CommentRepository;
import com.example.comp1640.repository.DocumentRepository;
import com.example.comp1640.repository.IdeaRepository;
import com.example.comp1640.service.ExportService;
import com.opencsv.CSVWriter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.URI;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class ExportServiceImpl implements ExportService {

   private final IdeaRepository ideaRepository;
   private final CommentRepository commentRepository;
   private final DocumentRepository documentRepository;

   public ExportServiceImpl(IdeaRepository ideaRepository, CommentRepository commentRepository,
         DocumentRepository documentRepository) {
      this.ideaRepository = ideaRepository;
      this.commentRepository = commentRepository;
      this.documentRepository = documentRepository;
   }

   @Override
   public void exportIdeasAndCommentsToCSV(Integer yearId, HttpServletResponse response) {
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
                  idea.getIsAnonymous() ? "Ẩn danh" : idea.getUser().getFullName(),
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
                     comment.getIsAnonymous() ? "Ẩn danh" : comment.getUser().getFullName(),
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
                  System.err.println("Error adding document to ZIP: " + doc.getFileName() + " - " + e.getMessage());
                  // Continue processing other documents
               }
            }
         }

         zos.close();
      } catch (IOException e) {
         throw new RuntimeException("Error exporting ZIP: " + e.getMessage(), e);
      }
   }

   private void downloadFileToZip(String fileUrl, ZipOutputStream zos) throws Exception {
      URI uri = new URI(fileUrl);
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
