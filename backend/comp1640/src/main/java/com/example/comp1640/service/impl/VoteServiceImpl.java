package com.example.comp1640.service.impl;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.comp1640.dto.request.VoteRequest;
import com.example.comp1640.dto.response.VoteResponse;
import com.example.comp1640.exception.BadRequestException;
import com.example.comp1640.exception.ResourceNotFoundException;
import com.example.comp1640.model.Idea;
import com.example.comp1640.model.User;
import com.example.comp1640.model.Vote;
import com.example.comp1640.model.Vote.VoteType;
import com.example.comp1640.repository.IdeaRepository;
import com.example.comp1640.repository.UserRepository;
import com.example.comp1640.repository.VoteRepository;
import com.example.comp1640.service.VoteService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VoteServiceImpl implements VoteService {

    private final VoteRepository voteRepo;
    private final IdeaRepository ideaRepo;
    private final UserRepository userRepo;

    @Override
    @Transactional
    public VoteResponse vote(Integer ideaId, VoteRequest request) {
        if (request.getVoteType() == null) {
            throw new BadRequestException("voteType không được để trống (UPVOTE hoặc DOWNVOTE)");
        }

        User currentUser = getCurrentUser();
        Idea idea = ideaRepo.findById(ideaId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ý tưởng id: " + ideaId));

        if (idea.getUser().getUserId().equals(currentUser.getUserId())) {
            throw new BadRequestException("Không thể vote ý tưởng của chính mình");
        }

        Optional<Vote> existing = voteRepo.findByIdea_IdeaIdAndUser_UserId(ideaId, currentUser.getUserId());

        if (existing.isPresent()) {
            Vote vote = existing.get();
            if (vote.getVoteType() == request.getVoteType()) {
                // Cùng loại → bỏ vote (toggle off)
                voteRepo.delete(vote);
            } else {
                // Khác loại → đổi vote
                vote.setVoteType(request.getVoteType());
                voteRepo.save(vote);
            }
        } else {
            Vote vote = new Vote();
            vote.setIdea(idea);
            vote.setUser(currentUser);
            vote.setVoteType(request.getVoteType());
            vote.setCreatedAt(LocalDateTime.now());
            voteRepo.save(vote);
        }

        return buildResponse(ideaId, currentUser.getUserId());
    }

    @Override
    public VoteResponse getVotes(Integer ideaId) {
        if (!ideaRepo.existsById(ideaId)) {
            throw new ResourceNotFoundException("Không tìm thấy ý tưởng id: " + ideaId);
        }

        Integer userId = getCurrentUserOptional().map(User::getUserId).orElse(null);
        return buildResponse(ideaId, userId);
    }

    @Override
    @Transactional
    public void deleteVote(Integer ideaId) {
        if (!ideaRepo.existsById(ideaId)) {
            throw new ResourceNotFoundException("Không tìm thấy ý tưởng id: " + ideaId);
        }
        User currentUser = getCurrentUser();
        voteRepo.findByIdea_IdeaIdAndUser_UserId(ideaId, currentUser.getUserId())
                .ifPresent(voteRepo::delete);
    }

    // --- helpers ---

    private VoteResponse buildResponse(Integer ideaId, Integer userId) {
        long upvotes   = voteRepo.countUpvotes(ideaId);
        long downvotes = voteRepo.countDownvotes(ideaId);
        VoteType userVote = null;
        if (userId != null) {
            userVote = voteRepo.findByIdea_IdeaIdAndUser_UserId(ideaId, userId)
                    .map(Vote::getVoteType)
                    .orElse(null);
        }
        return new VoteResponse(ideaId, upvotes, downvotes, userVote);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user hiện tại"));
    }

    private Optional<User> getCurrentUserOptional() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            return Optional.empty();
        }
        return userRepo.findByEmail(auth.getName());
    }
}
