package code_snippet_manager.dto;

import lombok.Data;

@Data
public class SnippetResponseDTO {

    private Long id;
    private String title;

    private String language;

    private String code;
}
