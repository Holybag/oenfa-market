package com.oenfa.oenfamarket.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import lombok.Data;

@Data
@Entity
public class Product {
    private @Id @GeneratedValue Long id;
    private String name;
    private String owner;
    private String image;
    private Date createdTime;
    private Date updatedTime;
    
    Product() {}

    Product(String name, String owner, String image) {
        this.name = name;
        this.owner = owner;
        this.image = image;
    }    
}