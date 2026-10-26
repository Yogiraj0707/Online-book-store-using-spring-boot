package com.paperandink.bookstore.config;

import com.paperandink.bookstore.model.Book;
import com.paperandink.bookstore.repository.BookRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BookDataInitializer {
    @Bean
    CommandLineRunner seedBooks(BookRepository bookRepository) {
        return args -> {
            List<Book> starterBooks = List.of(
                    new Book("The Midnight Library", "Matt Haig", new BigDecimal("1536.00"), "Fiction", 4.8,
                            "https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg", "Bestseller"),
                    new Book("Atomic Habits", "James Clear", new BigDecimal("1743.00"), "Self-growth", 4.9,
                            "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg", "Reader favorite"),
                    new Book("The Silent Patient", "Alex Michaelides", new BigDecimal("1390.00"), "Mystery", 4.7,
                            "https://covers.openlibrary.org/b/isbn/9781250301697-L.jpg", null),
                    new Book("Crying in H Mart", "Michelle Zauner", new BigDecimal("1598.00"), "Non-fiction", 4.8,
                            "https://covers.openlibrary.org/b/isbn/9780525657743-L.jpg", null),
                    new Book("Where the Crawdads Sing", "Delia Owens", new BigDecimal("1493.00"), "Fiction", 4.7,
                            "https://covers.openlibrary.org/b/isbn/9780735219090-L.jpg", "A modern classic"),
                    new Book("Educated", "Tara Westover", new BigDecimal("1660.00"), "Non-fiction", 4.8,
                            "https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg", null)
            );

            starterBooks.forEach(starterBook -> bookRepository.findByTitleIgnoreCase(starterBook.getTitle())
                    .ifPresentOrElse(
                            existingBook -> {
                                existingBook.setPrice(starterBook.getPrice());
                                bookRepository.save(existingBook);
                            },
                            () -> bookRepository.save(starterBook)
                    ));
        };
    }
}
