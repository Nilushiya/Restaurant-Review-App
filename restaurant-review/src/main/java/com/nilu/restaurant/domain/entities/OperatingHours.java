package com.nilu.restaurant.domain.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Entity
@Table(name = "operating_hours")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OperatingHours {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "monday_id", referencedColumnName = "id")
    @Field(type = FieldType.Nested)
    private TimeRange monday;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "tuesday_id", referencedColumnName = "id")
    @Field(type = FieldType.Nested)
    private TimeRange tuesday;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "wednesday_id", referencedColumnName = "id")
    @Field(type = FieldType.Nested)
    private TimeRange wednesday;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "thursday_id", referencedColumnName = "id")
    @Field(type = FieldType.Nested)
    private TimeRange thursday;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "friday_id", referencedColumnName = "id")
    @Field(type = FieldType.Nested)
    private TimeRange friday;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "saturday_id", referencedColumnName = "id")
    @Field(type = FieldType.Nested)
    private TimeRange saturday;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "sunday_id", referencedColumnName = "id")
    @Field(type = FieldType.Nested)
    private TimeRange sunday;

}
