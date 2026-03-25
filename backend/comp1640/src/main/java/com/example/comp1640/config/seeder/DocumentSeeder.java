package com.example.comp1640.config.seeder;

import com.example.comp1640.entity.Document;
import com.example.comp1640.entity.Idea;
import com.example.comp1640.repository.DocumentRepository;
import com.example.comp1640.repository.IdeaRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
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
      Idea idea1 = ideas.get(0);
      Idea idea2 = ideas.size() > 1 ? ideas.get(1) : idea1;

      docRepo.saveAll(List.of(
            createDoc("proposal_ai_test.pdf", "https://cloudinary/sample/proposal1.pdf", idea1),
            createDoc("design_diagram.png", "https://cloudinary/sample/diagram1.png", idea1),
            createDoc("presentation.pptx", "https://cloudinary/sample/ppt1.pptx", idea2),
            createDoc("budget.xlsx", "https://cloudinary/sample/budget1.xlsx", idea2),
            createDoc("research_doc.docx", "https://cloudinary/sample/research1.docx", idea1)));

      System.out.println("Seeded 5 documents.");
   }

   private Document createDoc(String originalName, String url, Idea idea) {
      Document doc = new Document();
      doc.setFileName(originalName);
      doc.setFileUrl(url);
      doc.setPublicId("sample_public_id_" + originalName);
      doc.setFileType(originalName.substring(originalName.lastIndexOf('.') + 1));
      doc.setIdea(idea);
      doc.setUploadedAt(LocalDateTime.now());
      return doc;
   }
}
