package com.bluelagoon.hotel.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Service
@Primary
public class SupabaseFileStorageService implements FileStorageService {

    private final String supabaseUrl;
    private final String supabaseKey;
    private final String bucketName;
    private final RestTemplate restTemplate;

    public SupabaseFileStorageService(
            @Value("${supabase.url:}") String supabaseUrl,
            @Value("${supabase.key:}") String supabaseKey,
            @Value("${supabase.bucket:}") String bucketName,
            RestTemplate restTemplate) {
        this.supabaseUrl = supabaseUrl;
        this.supabaseKey = supabaseKey;
        this.bucketName = bucketName;
        this.restTemplate = restTemplate;

        System.out.println(">>> CHECKING SUPABASE CONFIG >>>");
        if (supabaseUrl == null || supabaseUrl.isEmpty())
            System.err.println("!!! MISSING CONFIG: supabase.url (SUPABASE_URL) !!!");
        else
            System.out.println("URL: SET");

        if (supabaseKey == null || supabaseKey.isEmpty())
            System.err.println("!!! MISSING CONFIG: supabase.key (SUPABASE_KEY) !!!");
        else
            System.out.println("KEY: SET");

        if (bucketName == null || bucketName.isEmpty())
            System.err.println("!!! MISSING CONFIG: supabase.bucket (defaults to 'rooms') !!!");
        else
            System.out.println("BUCKET: " + bucketName);
    }

    @Override
    public String saveFile(MultipartFile file) {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + fileName;

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + supabaseKey);
            String contentType = file.getContentType();
            headers.setContentType(MediaType.valueOf(contentType != null ? contentType : "application/octet-stream"));

            HttpEntity<byte[]> requestEntity = new HttpEntity<>(file.getBytes(), headers);

            ResponseEntity<String> response = restTemplate.postForEntity(uploadUrl, requestEntity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                // Return the public URL
                return supabaseUrl + "/storage/v1/object/public/" + bucketName + "/" + fileName;
            } else {
                throw new RuntimeException("Failed to upload file to Supabase: " + response.getStatusCode());
            }

        } catch (Exception e) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", e);
        }
    }
}
