package bd.edu.seu.librarymanagementsystem.serviceImplementation;

import bd.edu.seu.librarymanagementsystem.model.Vendor;
import bd.edu.seu.librarymanagementsystem.service.DuplicateChecker;
import bd.edu.seu.librarymanagementsystem.service.VendorService;
import bd.edu.seu.librarymanagementsystem.util.StringUtils;
import bd.edu.seu.librarymanagementsystem.validator.VendorValidator;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

@Service
public class VendorServiceImplementation implements VendorService {

    private final CopyOnWriteArrayList<Vendor> vendorStore = new CopyOnWriteArrayList<>();
    private final DuplicateChecker duplicateChecker;

    public VendorServiceImplementation(DuplicateChecker duplicateChecker) {
        this.duplicateChecker = duplicateChecker;
    }

    @Override
    public Vendor saveVendor(Vendor vendor) {
        VendorValidator.validate(vendor);

        if (StringUtils.isBlank(vendor.getId())) {
            vendor.setId(UUID.randomUUID().toString());
        }
        vendor.setCreatedAtIfNull();

        if (duplicateChecker.isVendorNameDuplicate(vendor.getName(), vendorStore, null)) {
            throw new IllegalArgumentException("Vendor name already exists");
        }

        vendorStore.add(vendor);
        return vendor;
    }

    @Override
    public Vendor updateVendor(String id, Vendor vendor) {
        VendorValidator.validateId(id);
        VendorValidator.validate(vendor);

        Vendor existing = getVendorById(id);
        if (existing == null) {
            throw new IllegalArgumentException("Vendor not found with ID: " + id);
        }

        if (!existing.getName().equalsIgnoreCase(vendor.getName())) {
            if (duplicateChecker.isVendorNameDuplicate(vendor.getName(), vendorStore, id)) {
                throw new IllegalArgumentException("Vendor name already exists");
            }
        }

        existing.setName(vendor.getName());
        existing.setEmail(vendor.getEmail());
        existing.setPhone(vendor.getPhone());
        existing.setAddress(vendor.getAddress());
        return existing;
    }

    @Override
    public void deleteVendor(String id) {
        VendorValidator.validateId(id);
        boolean removed = vendorStore.removeIf(vendor -> id.equals(vendor.getId()));
        if (!removed) {
            throw new IllegalArgumentException("Vendor not found with ID: " + id);
        }
    }

    @Override
    public List<Vendor> getAllVendors() {
        return List.copyOf(vendorStore);
    }

    @Override
    public Vendor getVendorById(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        return vendorStore.stream()
                .filter(vendor -> id.equals(vendor.getId()))
                .findFirst()
                .orElse(null);
    }

    @Override
    public List<Vendor> searchVendors(String searchTerm) {
        if (StringUtils.isBlank(searchTerm)) {
            return getAllVendors();
        }
        String lowerSearchTerm = searchTerm.toLowerCase().trim();
        return vendorStore.stream()
                .filter(vendor -> {
                    String name = vendor.getName() != null ? vendor.getName().toLowerCase() : "";
                    String email = vendor.getEmail() != null ? vendor.getEmail().toLowerCase() : "";
                    String phone = vendor.getPhone() != null ? vendor.getPhone().toLowerCase() : "";
                    String address = vendor.getAddress() != null ? vendor.getAddress().toLowerCase() : "";
                    return name.contains(lowerSearchTerm) || email.contains(lowerSearchTerm) ||
                            phone.contains(lowerSearchTerm) || address.contains(lowerSearchTerm);
                })
                .collect(Collectors.toList());
    }
}
