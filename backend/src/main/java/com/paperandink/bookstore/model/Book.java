package com.paperandink.bookstore.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "books")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private String category;

    private Double rating;
    private String coverUrl;
    private String badge;

    protected Book() {
    }

    public Book(String title, String author, BigDecimal price, String category, Double rating, String coverUrl, String badge) {
        this.title = title;
        this.author = author;
        this.price = price;
        this.category = category;
        this.rating = rating;
        this.coverUrl = coverUrl;
        this.badge = badge;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getAuthor() { return author; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getCategory() { return category; }
    public Double getRating() { return rating; }
    public String getCoverUrl() { return coverUrl; }
    public String getBadge() { return badge; }
}
