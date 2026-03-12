package com.example.comp1640.dto.request;

import com.example.comp1640.entity.Vote.VoteType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VoteRequest {
    private VoteType voteType; // UPVOTE hoặc DOWNVOTE
}
