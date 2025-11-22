package bd.edu.seu.librarymanagementsystem.service;

import bd.edu.seu.librarymanagementsystem.dto.AllotmentResponseDTO;
import bd.edu.seu.librarymanagementsystem.model.Allotment;

import java.util.List;

public interface AllotmentService {
    Allotment saveAllotment(Allotment allotment);

    Allotment updateAllotment(String id, Allotment allotment);

    void deleteAllotment(String id);

    List<AllotmentResponseDTO> getAllAllotments();

    AllotmentResponseDTO getAllotmentById(String id);

    List<AllotmentResponseDTO> searchAllotments(String searchTerm);

    Allotment returnBook(String id);

    Long calculateFine(Allotment allotment);
}
