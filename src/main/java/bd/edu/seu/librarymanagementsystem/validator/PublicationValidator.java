package bd.edu.seu.librarymanagementsystem.validator;

import bd.edu.seu.librarymanagementsystem.model.Publication;
import bd.edu.seu.librarymanagementsystem.util.StringUtils;

public class PublicationValidator {

    private PublicationValidator() {
        
    }

    public static void validate(Publication publication) {
        if (publication == null) {
            throw new IllegalArgumentException("Publication must not be null");
        }
        if (StringUtils.isBlank(publication.getName())) {
            throw new IllegalArgumentException("Publication name must not be blank");
        }
    }

    public static void validateId(String id) {
        if (StringUtils.isBlank(id)) {
            throw new IllegalArgumentException("Publication ID must not be blank");
        }
    }
}
