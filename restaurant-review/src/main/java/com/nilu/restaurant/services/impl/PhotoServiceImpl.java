package com.nilu.restaurant.services.impl;

import com.nilu.restaurant.domain.entities.Photo;
import com.nilu.restaurant.exceptions.PhotoNotFoundException;
import com.nilu.restaurant.exceptions.StorageException;
import com.nilu.restaurant.services.PhotoService;
import com.nilu.restaurant.services.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.elasticsearch.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PhotoServiceImpl implements PhotoService {

    private final StorageService storageService;
    @Override
    public Photo uploadPhoto(MultipartFile file) {
        String photoId = UUID.randomUUID().toString();
        String url = storageService.store(file, photoId);

        return Photo.builder()
                .url(url)
                .uploadDate(LocalDateTime.now())
                .build();
    }

    @Override
    public Optional<Resource> getPhotoAsResource(String id) {
        return storageService.loadAsResource(id);
    }

    @Override
    public void deletePhoto(String photoId) {
        try {
            Optional<Resource> resource = storageService.loadAsResource(photoId);

            if (resource.isEmpty()) {
                throw new PhotoNotFoundException("No resource found to delete for ID: " + photoId);
            }
            storageService.delete(photoId);
            System.out.println("Photo deleted successfully: " + photoId);

        } catch (PhotoNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete photo file: " + photoId, e);
        }
    }

}
