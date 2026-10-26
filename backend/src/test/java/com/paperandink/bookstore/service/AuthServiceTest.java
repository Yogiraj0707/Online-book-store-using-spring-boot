package com.paperandink.bookstore.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.paperandink.bookstore.dto.AuthRequest;
import com.paperandink.bookstore.dto.RegisterRequest;
import com.paperandink.bookstore.dto.UserResponse;
import com.paperandink.bookstore.model.StoreUser;
import com.paperandink.bookstore.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @Test
    void registerStoresNormalizedEmailAndEncodedPassword() {
        when(userRepository.existsByEmailIgnoreCase("jamie@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("bcrypt-hash");
        when(userRepository.save(any(StoreUser.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponse response = authService.register(new RegisterRequest(
                " Jamie ", " Parker ", "Jamie@Example.com", "password123"));

        ArgumentCaptor<StoreUser> userCaptor = ArgumentCaptor.forClass(StoreUser.class);
        verify(userRepository).save(userCaptor.capture());
        assertEquals("jamie@example.com", userCaptor.getValue().getEmail());
        assertEquals("bcrypt-hash", userCaptor.getValue().getPasswordHash());
        assertEquals("Jamie", response.firstName());
        assertEquals("jamie@example.com", response.email());
    }

    @Test
    void loginReturnsPublicProfileForMatchingPassword() {
        StoreUser user = new StoreUser("Jamie", "Parker", "jamie@example.com", "bcrypt-hash");
        when(userRepository.findByEmailIgnoreCase("jamie@example.com")).thenReturn(java.util.Optional.of(user));
        when(passwordEncoder.matches("password123", "bcrypt-hash")).thenReturn(true);

        UserResponse response = authService.login(new AuthRequest("jamie@example.com", "password123"));

        assertEquals("Jamie", response.firstName());
        assertEquals("jamie@example.com", response.email());
    }

    @Test
    void loginRejectsIncorrectPassword() {
        StoreUser user = new StoreUser("Jamie", "Parker", "jamie@example.com", "bcrypt-hash");
        when(userRepository.findByEmailIgnoreCase("jamie@example.com")).thenReturn(java.util.Optional.of(user));
        when(passwordEncoder.matches("incorrect", "bcrypt-hash")).thenReturn(false);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> authService.login(new AuthRequest("jamie@example.com", "incorrect")));

        assertEquals(HttpStatus.UNAUTHORIZED, exception.getStatusCode());
    }
}
