package demo.modal.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Data
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class Time {
    @Column(updatable = false)
    private LocalDateTime created;

    @Column
    private LocalDateTime modified;

    @PrePersist
    public void prePersist() {
        created = LocalDateTime.now();
        modified = null;
    }

    @PreUpdate
    public void preUpdate() {
        modified = LocalDateTime.now();
    }
}
