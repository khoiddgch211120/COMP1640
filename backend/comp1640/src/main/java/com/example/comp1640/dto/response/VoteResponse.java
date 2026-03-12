package com.example.comp1640.dto.response;

import com.example.comp1640.entity.Vote.VoteType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class VoteResponse {
    private Integer ideaId;
    private long upvotes;
    private long downvotes;
    private VoteType userVote; // null nếu chưa vote hoặc guest
}
