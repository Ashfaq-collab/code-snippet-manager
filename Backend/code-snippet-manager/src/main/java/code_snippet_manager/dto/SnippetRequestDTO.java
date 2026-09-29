package code_snippet_manager.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SnippetRequestDTO {

    @NotBlank(message = "Title is required")
    private String title;
    @NotBlank(message = "Language is required")
    private String language;
    @NotBlank(message = "Code is required")
    private String code;
}
