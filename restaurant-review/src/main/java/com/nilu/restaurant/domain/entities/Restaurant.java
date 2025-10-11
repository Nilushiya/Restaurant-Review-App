package com.nilu.restaurant.domain.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.nilu.restaurant.domain.GeoLocation;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;
import jakarta.persistence.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.GeoPointField;
import org.springframework.data.elasticsearch.core.geo.GeoPoint;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "restaurants")
@Document(indexName = "restaurants")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Restaurant {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    @Field(type = FieldType.Keyword)
    private String id;

    @Column(nullable = false)
    @Field(type = FieldType.Text)
    private String name;

    @Field(type = FieldType.Text)
    private String cuisineType;

    @Field(type = FieldType.Keyword)
    private String contactInformation;

    @Field(type = FieldType.Float)
    private Float averageRating;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "geo_location_id", referencedColumnName = "id")
    private GeoLocation geoLocationEntity;

    @Transient
    @GeoPointField
    private GeoPoint geoLocation;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "address_id", referencedColumnName = "id")
    @Field(type = FieldType.Nested)
    private Address address;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "operating_hours_id", referencedColumnName = "id")
    @Field(type = FieldType.Nested)
    private OperatingHours operatingHours;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "photo_id", referencedColumnName = "id")
    @Field(type = FieldType.Nested)
    private List<Photo> photos = new ArrayList<>();

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    @Field(type = FieldType.Nested)
    private List<Review> reviews = new ArrayList<>();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by_user_id", referencedColumnName = "id")
    @Field(type = FieldType.Nested)
    private User createdBy;
}
