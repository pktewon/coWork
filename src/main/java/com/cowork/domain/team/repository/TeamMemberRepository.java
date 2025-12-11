package com.cowork.domain.team.repository;

import com.cowork.domain.team.entity.Team;
import com.cowork.domain.team.entity.TeamMember;
import com.cowork.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {

    List<TeamMember> findByUser(User user);

    List<TeamMember> findByTeam(Team team);

    boolean existsByUserAndTeam(User user, Team team);
}
