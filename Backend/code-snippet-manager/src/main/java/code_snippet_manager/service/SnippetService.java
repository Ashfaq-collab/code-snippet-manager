package code_snippet_manager.service;

import code_snippet_manager.customException.ResourceNotFoundException;
import code_snippet_manager.dto.SnippetRequestDTO;
import code_snippet_manager.dto.SnippetResponseDTO;
import code_snippet_manager.entity.Snippet;
import code_snippet_manager.repository.SnippetRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SnippetService {
    private SnippetRepository snippetRepository;

    public SnippetService(SnippetRepository snippetRepository) {
        this.snippetRepository = snippetRepository;
    }

    public List<SnippetResponseDTO> getAll() {
        List<Snippet> snippet = snippetRepository.findAll();
        return snippet.stream()
                .map(this::convertToSnippetResponseDTO)
                .toList();
    }

    public SnippetResponseDTO createSnippet(SnippetRequestDTO snippet) {
        Snippet snippetEntity = new Snippet();

        snippetEntity.setTitle(snippet.getTitle());
        snippetEntity.setLanguage(snippet.getLanguage());
        snippetEntity.setCode(snippet.getCode());

        Snippet savedsnippet= snippetRepository.save(snippetEntity);
        return convertToSnippetResponseDTO(savedsnippet);

    }

    public SnippetResponseDTO updateSnippet(SnippetRequestDTO snippet, Long id) {
        Snippet existingSnippet = snippetRepository.findById(id).orElseThrow(()->
                new ResourceNotFoundException("Snippet with id " + id + " not found"));
        if(snippet.getTitle()!=null){
            existingSnippet.setTitle(snippet.getTitle());
        }
        if(snippet.getLanguage()!=null){
            existingSnippet.setLanguage(snippet.getLanguage());
        }
        if(snippet.getCode()!=null){
            existingSnippet.setCode(snippet.getCode());
        }

        Snippet updatedSnippet = snippetRepository.save(existingSnippet);
        return convertToSnippetResponseDTO(updatedSnippet);
    }

    public String deleteSnippet(Long id) {
        snippetRepository.deleteById(id);
        return "Snippet with id " + id + " was deleted";
    }

    public SnippetResponseDTO convertToSnippetResponseDTO(Snippet snippet) {
        SnippetResponseDTO snippetResponseDTO = new SnippetResponseDTO();
        snippetResponseDTO.setId(snippet.getId());
        snippetResponseDTO.setTitle(snippet.getTitle());
        snippetResponseDTO.setLanguage(snippet.getLanguage());
        snippetResponseDTO.setCode(snippet.getCode());

        return snippetResponseDTO;
    }
}
