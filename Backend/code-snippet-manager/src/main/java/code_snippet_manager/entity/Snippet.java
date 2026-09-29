package code_snippet_manager.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name="snippet")
@Data
public class Snippet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String language;

    private String code;
}
