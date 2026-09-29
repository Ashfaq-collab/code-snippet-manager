package code_snippet_manager.repository;

import code_snippet_manager.entity.Snippet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SnippetRepository extends JpaRepository<Snippet, Long> {

}
