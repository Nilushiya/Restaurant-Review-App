package com.nilu.restaurant.controllers;

import com.nilu.restaurant.domain.dtos.PhotoDto;
import com.nilu.restaurant.domain.entities.Photo;
import com.nilu.restaurant.mappers.PhotoMapper;
import com.nilu.restaurant.services.PhotoService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@SecurityRequirement(name = "KeyCloak")
@RequestMapping(path = "/api/photos")
@CrossOrigin("*")
public class PhotoController {

    private final PhotoService photoService;
    private final PhotoMapper photoMapper;

    @PostMapping
//    @PreAuthorize("hasRole('restaurantAdmin')")
    public List<PhotoDto> uploadPhoto(@RequestParam("files") List<MultipartFile> files) {
        return files.stream()
                .map(photoService::uploadPhoto)
                .map(photoMapper::toDto)
                .toList();
    }

    @GetMapping(path = "/{id:.+}")
    public ResponseEntity<Resource> getPhoto(@PathVariable String id) {
        return photoService.getPhotoAsResource(id).map(photo ->
                ResponseEntity.ok()
                        .contentType(
                                MediaTypeFactory.getMediaType(photo)
                                        .orElse(MediaType.APPLICATION_OCTET_STREAM)
                        )
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                        .body(photo)
        ).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping(path = "/{id:.+}")
    public ResponseEntity<Void> deletePhotos(@PathVariable String id) {
        photoService.deletePhoto(id);
        return ResponseEntity.noContent().build();
    }

}
