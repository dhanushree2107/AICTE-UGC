package com.aicte.notification.controller;

import com.aicte.notification.entity.Notice;
import com.aicte.notification.entity.Notification;
import com.aicte.notification.repository.NoticeRepository;
import com.aicte.notification.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping
public class NotificationController {

    @Autowired
    private NoticeRepository noticeRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    // Public API - GET /api/public/notices
    @GetMapping("/api/public/notices")
    public ResponseEntity<List<Notice>> getPublicNotices() {
        return ResponseEntity.ok(noticeRepository.findAllByOrderByPublishDateDesc());
    }

    // Protected APIs
    @GetMapping("/api/notifications")
    public ResponseEntity<List<Notification>> getMyNotifications(@AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getClaimAsString("preferred_username");
        return ResponseEntity.ok(notificationRepository.findByUserIdOrderByCreatedAtDesc(username));
    }

    @PostMapping("/api/notifications")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_AICTE_ADMIN', 'ROLE_REGIONAL_OFFICER')")
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
        notification.setIsRead(false);
        return ResponseEntity.ok(notificationRepository.save(notification));
    }

    @PutMapping("/api/notifications/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        Optional<Notification> notifOpt = notificationRepository.findById(id);
        if (notifOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Notification notification = notifOpt.get();
        notification.setIsRead(true);
        return ResponseEntity.ok(notificationRepository.save(notification));
    }
}
