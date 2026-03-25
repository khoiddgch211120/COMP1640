package com.example.comp1640.service;

import jakarta.servlet.http.HttpServletResponse;

public interface ExportService {

   /**
    * Export all ideas and comments to CSV format
    * 
    * @param yearId   The academic year ID
    * @param response HTTP response to write CSV content
    */
   void exportIdeasAndCommentsToCSV(Integer yearId, HttpServletResponse response);

   /**
    * Export all documents/attachments as a ZIP file
    * 
    * @param yearId   The academic year ID
    * @param response HTTP response to write ZIP content
    */
   void exportAttachmentsAsZip(Integer yearId, HttpServletResponse response);
}
