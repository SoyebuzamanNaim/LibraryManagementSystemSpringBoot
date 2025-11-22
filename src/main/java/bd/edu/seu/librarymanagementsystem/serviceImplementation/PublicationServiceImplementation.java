package bd.edu.seu.librarymanagementsystem.serviceImplementation;

import bd.edu.seu.librarymanagementsystem.model.Publication;
import bd.edu.seu.librarymanagementsystem.service.DuplicateChecker;
import bd.edu.seu.librarymanagementsystem.service.PublicationService;
import bd.edu.seu.librarymanagementsystem.util.StringUtils;
import bd.edu.seu.librarymanagementsystem.validator.PublicationValidator;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

@Service
public class PublicationServiceImplementation implements PublicationService {

    private final CopyOnWriteArrayList<Publication> publicationStore = new CopyOnWriteArrayList<>();
    private final DuplicateChecker duplicateChecker;

    public PublicationServiceImplementation(DuplicateChecker duplicateChecker) {
        this.duplicateChecker = duplicateChecker;
    }

    @Override
    public Publication savePublication(Publication publication) {
        PublicationValidator.validate(publication);

        if (StringUtils.isBlank(publication.getId())) {
            publication.setId(UUID.randomUUID().toString());
        }
        publication.setCreatedAtIfNull();

        if (duplicateChecker.isPublicationNameDuplicate(publication.getName(), publicationStore, null)) {
            throw new IllegalArgumentException("Publication name already exists");
        }

        publicationStore.add(publication);
        return publication;
    }

    @Override
    public Publication updatePublication(String id, Publication publication) {
        PublicationValidator.validateId(id);
        PublicationValidator.validate(publication);

        Publication existing = getPublicationById(id);
        if (existing == null) {
            throw new IllegalArgumentException("Publication not found with ID: " + id);
        }

        if (!existing.getName().equalsIgnoreCase(publication.getName())) {
            if (duplicateChecker.isPublicationNameDuplicate(publication.getName(), publicationStore, id)) {
                throw new IllegalArgumentException("Publication name already exists");
            }
        }

        existing.setName(publication.getName());
        existing.setAddress(publication.getAddress());
        return existing;
    }

    @Override
    public void deletePublication(String id) {
        PublicationValidator.validateId(id);
        boolean removed = publicationStore.removeIf(pub -> id.equals(pub.getId()));
        if (!removed) {
            throw new IllegalArgumentException("Publication not found with ID: " + id);
        }
    }

    @Override
    public List<Publication> getAllPublications() {
        return List.copyOf(publicationStore);
    }

    @Override
    public Publication getPublicationById(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        return publicationStore.stream()
                .filter(pub -> id.equals(pub.getId()))
                .findFirst()
                .orElse(null);
    }

    @Override
    public List<Publication> searchPublications(String searchTerm) {
        if (StringUtils.isBlank(searchTerm)) {
            return getAllPublications();
        }
        String lowerSearchTerm = searchTerm.toLowerCase().trim();
        return publicationStore.stream()
                .filter(pub -> {
                    String name = pub.getName() != null ? pub.getName().toLowerCase() : "";
                    String address = pub.getAddress() != null ? pub.getAddress().toLowerCase() : "";
                    return name.contains(lowerSearchTerm) || address.contains(lowerSearchTerm);
                })
                .collect(Collectors.toList());
    }
}
