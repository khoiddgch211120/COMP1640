package com.example.comp1640.dto.request;

import com.example.comp1640.entity.Vote.VoteType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoteRequest {
    private VoteType voteType; // UPVOTE hoặc DOWNVOTE
}
