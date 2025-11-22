package bd.edu.seu.librarymanagementsystem.validator;

import bd.edu.seu.librarymanagementsystem.model.Vendor;
import bd.edu.seu.librarymanagementsystem.util.StringUtils;

public class VendorValidator {

    private VendorValidator() {
    //   prevent instantiation
    }

    public static void validate(Vendor vendor) {
        if (vendor == null) {
            throw new IllegalArgumentException("Vendor must not be null");
        }
        if (StringUtils.isBlank(vendor.getName())) {
            throw new IllegalArgumentException("Vendor name must not be blank");
        }
    }

    public static void validateId(String id) {
        if (StringUtils.isBlank(id)) {
            throw new IllegalArgumentException("Vendor ID must not be blank");
        }
    }
}
