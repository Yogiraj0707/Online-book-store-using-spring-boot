package com.paperandink.bookstore.repository;

import com.paperandink.bookstore.model.StoreUser;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<StoreUser, Long> {
    Optional<StoreUser> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
}
