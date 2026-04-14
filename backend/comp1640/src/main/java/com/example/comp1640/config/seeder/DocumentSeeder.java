package com.example.comp1640.config.seeder;

import com.example.comp1640.entity.Document;
import com.example.comp1640.entity.Idea;
import com.example.comp1640.repository.DocumentRepository;
import com.example.comp1640.repository.IdeaRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(11)
public class DocumentSeeder implements CommandLineRunner {

   @Autowired
   private DocumentRepository docRepo;

   @Autowired
   private IdeaRepository ideaRepo;

   @Override
   public void run(String... args) throws Exception {
      if (docRepo.count() > 0 || ideaRepo.count() == 0) {
         System.out.println("Documents already seeded or no ideas.");
         return;
      }

      List<Idea> ideas = ideaRepo.findAll();
      List<Document> documents = new java.util.ArrayList<>();

      String[] fileNames = {
            "proposal.pdf", "design_diagram.png", "presentation.pptx", "budget.xlsx",
            "technical_spec.docx", "timeline.xlsx", "risk_analysis.pdf", "research_paper.pdf",
            "architecture.png", "mockups.figma", "requirements.txt", "implementation_guide.docx"
      };

      // Add 1-3 documents per idea
      for (int i = 0; i < ideas.size(); i++) {
         Idea idea = ideas.get(i);
         int numDocs = (i % 3) + 1; // 1-3 docs per idea

         for (int j = 0; j < numDocs; j++) {
            String fileName = fileNames[(i * 5 + j) % fileNames.length];
            String fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
            String publicId = "doc_" + idea.getIdeaId() + "_" + j;
            String fileUrl = "https://res.cloudinary.com/sample/" + idea.getIdeaId() + "/" + fileName;

            documents.add(createDoc(fileName, fileUrl, publicId, fileExtension, idea));
         }
      }

      docRepo.saveAll(documents);
      System.out.println("Seeded " + documents.size() + " documents.");
   }

   private Document createDoc(String fileName, String url, String publicId, String fileType, Idea idea) {
      Document doc = new Document();
      doc.setFileName(fileName);
      doc.setFileUrl(url);
      doc.setPublicId(publicId);
      doc.setFileType(fileType);
      doc.setIdea(idea);
      doc.setUploadedAt(LocalDateTime.now());
      return doc;
   }
}
