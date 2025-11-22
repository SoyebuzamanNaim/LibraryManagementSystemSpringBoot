package bd.edu.seu.librarymanagementsystem.service;

import bd.edu.seu.librarymanagementsystem.model.Vendor;

import java.util.List;

public interface VendorService {

    Vendor saveVendor(Vendor vendor);

    Vendor updateVendor(String id, Vendor vendor);

    void deleteVendor(String id);

    List<Vendor> getAllVendors();

    Vendor getVendorById(String id);

    List<Vendor> searchVendors(String searchTerm);
}
