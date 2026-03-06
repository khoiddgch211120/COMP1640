package com.example.comp1640.service;

import com.example.comp1640.dto.request.VoteRequest;
import com.example.comp1640.dto.response.VoteResponse;

public interface VoteService {

    /** Vote hoặc đổi vote. Nếu vote cùng loại → bỏ vote (toggle off). */
    VoteResponse vote(Integer ideaId, VoteRequest request);

    /** Lấy số vote của một idea (guest được xem). */
    VoteResponse getVotes(Integer ideaId);

    /** Hủy vote của user hiện tại cho idea. */
    void deleteVote(Integer ideaId);
}
