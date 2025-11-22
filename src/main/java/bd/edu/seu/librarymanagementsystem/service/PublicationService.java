package bd.edu.seu.librarymanagementsystem.service;

import bd.edu.seu.librarymanagementsystem.model.Publication;

import java.util.List;

public interface PublicationService {

    Publication savePublication(Publication publication);

    Publication updatePublication(String id, Publication publication);

    void deletePublication(String id);

    List<Publication> getAllPublications();

    Publication getPublicationById(String id);

    List<Publication> searchPublications(String searchTerm);
}
