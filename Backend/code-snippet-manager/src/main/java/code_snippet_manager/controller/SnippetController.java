package code_snippet_manager.controller;

import code_snippet_manager.dto.SnippetRequestDTO;
import code_snippet_manager.dto.SnippetResponseDTO;
import code_snippet_manager.entity.Snippet;
import code_snippet_manager.repository.SnippetRepository;
import code_snippet_manager.service.SnippetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/snippets")
@CrossOrigin(origins = "*")
public class SnippetController {

    private final SnippetService snippetService;

    public SnippetController(SnippetService snippetService) {
        this.snippetService = snippetService;
    }

    @GetMapping
    public ResponseEntity<List<?>> getAllSnippets() {
        return new ResponseEntity<>(snippetService.getAll(), HttpStatus.OK);
    }
    @PostMapping
    public ResponseEntity<?> createSnippet(@RequestBody SnippetRequestDTO snippet) {
        return new ResponseEntity<>(snippetService.createSnippet(snippet), HttpStatus.CREATED);
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSnippet(@RequestBody SnippetRequestDTO snippet,
                                           @PathVariable Long id) {
        return new ResponseEntity<>(snippetService.updateSnippet(snippet,id), HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSnippet(@PathVariable Long id) {
        return new ResponseEntity<>(snippetService.deleteSnippet(id), HttpStatus.OK);
    }
}
