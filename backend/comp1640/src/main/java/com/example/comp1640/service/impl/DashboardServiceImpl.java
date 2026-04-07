package com.example.comp1640.service.impl;

import com.example.comp1640.dto.response.DashboardResponse;
import com.example.comp1640.entity.AcademicYear;
import com.example.comp1640.entity.Department;
import com.example.comp1640.entity.Idea;
import com.example.comp1640.entity.User;
import com.example.comp1640.repository.AcademicYearRepository;
import com.example.comp1640.repository.CommentRepository;
import com.example.comp1640.repository.DepartmentRepository;
import com.example.comp1640.repository.IdeaRepository;
import com.example.comp1640.repository.UserRepository;
import com.example.comp1640.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

        private final IdeaRepository ideaRepository;
        private final UserRepository userRepository;
        private final AcademicYearRepository academicYearRepository;
        private final DepartmentRepository departmentRepository;
        private final CommentRepository commentRepository;

        @Override
        public DashboardResponse getDashboard(Integer deptId) {
                return deptId == null ? buildOverall() : buildByDept(deptId);
        }

        // ── Overall (toàn trường) ─────────────────────────────────────────────────

        private DashboardResponse buildOverall() {
                List<Idea> allIdeas = ideaRepository.findAll();
                List<User> allUsers = userRepository.findAll();
                List<Department> depts = departmentRepository.findAll();

                // Năm học hiện tại để tính ideas_this_year
                LocalDate today = LocalDate.now();
                Integer ideasThisYear = academicYearRepository.findCurrentActive(today)
                                .or(() -> academicYearRepository.findLatest())
                                .map(y -> (int) allIdeas.stream()
                                                .filter(i -> i.getAcademicYear() != null
                                                                && i.getAcademicYear().getYearId()
                                                                                .equals(y.getYearId()))
                                                .count())
                                .orElse(0);

                long totalComments = commentRepository.count();
                long anonymousIdeas = allIdeas.stream().filter(i -> Boolean.TRUE.equals(i.getIsAnonymous())).count();

                // Ideas with/without comments
                long withComments = allIdeas.stream()
                                .filter(i -> commentRepository.countByIdeaIdeaId(i.getIdeaId()) > 0)
                                .count();
                long withoutComments = allIdeas.size() - withComments;

                // Monthly trend — 8 tháng gần nhất
                List<DashboardResponse.MonthlyTrend> monthlyTrend = buildMonthlyTrend(allIdeas);

                // Top contributors — top 5 theo số ideas
                List<DashboardResponse.TopContributor> topContributors = buildTopContributors(allIdeas, true);

                // Breakdown by department
                List<DashboardResponse.DeptBreakdown> byDepartment = buildDeptBreakdown(allIdeas, depts);

                DashboardResponse resp = new DashboardResponse();
                resp.setTotalIdeas(allIdeas.size());
                resp.setTotalComments((int) totalComments);
                resp.setTotalUsers(allUsers.size());
                resp.setTotalDepartments(depts.size());
                resp.setIdeasThisYear(ideasThisYear);
                resp.setAnonymousIdeas((int) anonymousIdeas);
                resp.setIdeasWithComments((int) withComments);
                resp.setIdeasWithoutComments((int) withoutComments);
                resp.setDeptName(null);
                resp.setMonthlyTrend(monthlyTrend);
                resp.setTopContributors(topContributors);
                resp.setByDepartment(byDepartment);
                return resp;
        }

        // ── By Department ─────────────────────────────────────────────────────────

        private DashboardResponse buildByDept(Integer deptId) {
                List<Idea> deptIdeas = ideaRepository.findByDepartment_DeptId(deptId);
                List<User> deptUsers = userRepository.findByDepartment_DeptId(deptId);

                String deptName = departmentRepository.findById(deptId)
                                .map(Department::getDeptName)
                                .orElse("Department #" + deptId);

                long totalComments = deptIdeas.stream()
                                .mapToLong(i -> commentRepository.countByIdeaIdeaId(i.getIdeaId()))
                                .sum();
                long anonymousIdeas = deptIdeas.stream()
                                .filter(i -> Boolean.TRUE.equals(i.getIsAnonymous()))
                                .count();

                long withComments = deptIdeas.stream()
                                .filter(i -> commentRepository.countByIdeaIdeaId(i.getIdeaId()) > 0)
                                .count();
                long withoutComments = deptIdeas.size() - withComments;

                List<DashboardResponse.MonthlyTrend> monthlyTrend = buildMonthlyTrend(deptIdeas);
                List<DashboardResponse.TopContributor> topContributors = buildTopContributors(deptIdeas, false);

                DashboardResponse resp = new DashboardResponse();
                resp.setTotalIdeas(deptIdeas.size());
                resp.setTotalComments((int) totalComments);
                resp.setTotalUsers(deptUsers.size());
                resp.setTotalDepartments(null);
                resp.setIdeasThisYear(deptIdeas.size()); // trong context dept, hiển thị tổng ideas dept
                resp.setAnonymousIdeas((int) anonymousIdeas);
                resp.setIdeasWithComments((int) withComments);
                resp.setIdeasWithoutComments((int) withoutComments);
                resp.setDeptName(deptName);
                resp.setMonthlyTrend(monthlyTrend);
                resp.setTopContributors(topContributors);
                resp.setByDepartment(null); // không cần khi đang xem theo dept
                return resp;
        }

        // ── Shared helpers ────────────────────────────────────────────────────────

        /**
         * Tính trend 8 tháng gần nhất từ danh sách ideas.
         * Format month label: "Jan 25", "Feb 25"...
         */
        private List<DashboardResponse.MonthlyTrend> buildMonthlyTrend(List<Idea> ideas) {
                DateTimeFormatter labelFmt = DateTimeFormatter.ofPattern("MMM yy");
                LocalDate now = LocalDate.now();

                List<DashboardResponse.MonthlyTrend> result = new ArrayList<>();
                for (int i = 7; i >= 0; i--) {
                        LocalDate month = now.minusMonths(i).withDayOfMonth(1);
                        String label = month.format(labelFmt); // "Jan 25"

                        long count = ideas.stream()
                                        .filter(idea -> idea.getSubmittedAt() != null)
                                        .filter(idea -> {
                                                LocalDate submitted = idea.getSubmittedAt().toLocalDate();
                                                return submitted.getYear() == month.getYear()
                                                                && submitted.getMonthValue() == month.getMonthValue();
                                        })
                                        .count();

                        result.add(new DashboardResponse.MonthlyTrend(label, (int) count));
                }
                return result;
        }

        /**
         * Tính top 5 contributors từ danh sách ideas.
         * 
         * @param includeDeptName true khi overall, false khi filter theo dept
         */
        private List<DashboardResponse.TopContributor> buildTopContributors(
                        List<Idea> ideas, boolean includeDeptName) {

                // Group ideas by user
                Map<User, Long> countByUser = ideas.stream()
                                .filter(i -> i.getUser() != null)
                                .collect(Collectors.groupingBy(Idea::getUser, Collectors.counting()));

                return countByUser.entrySet().stream()
                                .sorted(Map.Entry.<User, Long>comparingByValue().reversed())
                                .limit(5)
                                .map(entry -> {
                                        User u = entry.getKey();
                                        String initial = (u.getFullName() != null && !u.getFullName().isEmpty())
                                                        ? String.valueOf(u.getFullName().charAt(0)).toUpperCase()
                                                        : "?";
                                        String deptName = (includeDeptName && u.getDepartment() != null)
                                                        ? u.getDepartment().getDeptName()
                                                        : null;
                                        return new DashboardResponse.TopContributor(
                                                        u.getFullName(),
                                                        deptName,
                                                        entry.getValue().intValue(),
                                                        initial);
                                })
                                .collect(Collectors.toList());
        }

        /**
         * Tính breakdown theo từng phòng ban (chỉ dùng cho overall).
         * Tính percent = idea_count / total_ideas * 100
         */
        private List<DashboardResponse.DeptBreakdown> buildDeptBreakdown(
                        List<Idea> allIdeas, List<Department> depts) {

                int total = allIdeas.isEmpty() ? 1 : allIdeas.size();

                return depts.stream()
                                .map(dept -> {
                                        List<Idea> deptIdeas = allIdeas.stream()
                                                        .filter(i -> i.getDepartment() != null
                                                                        && i.getDepartment().getDeptId()
                                                                                        .equals(dept.getDeptId()))
                                                        .collect(Collectors.toList());

                                        int ideaCount = deptIdeas.size();

                                        long commentCount = deptIdeas.stream()
                                                        .mapToLong(i -> commentRepository
                                                                        .countByIdeaIdeaId(i.getIdeaId()))
                                                        .sum();

                                        long userCount = userRepository.findByDepartment_DeptId(dept.getDeptId())
                                                        .size();

                                        int percent = (int) Math.round((double) ideaCount / total * 100);

                                        return new DashboardResponse.DeptBreakdown(
                                                        dept.getDeptId(),
                                                        dept.getDeptName(),
                                                        ideaCount,
                                                        (int) commentCount,
                                                        (int) userCount,
                                                        percent);
                                })
                                // Sắp xếp theo idea_count giảm dần để chart đẹp hơn
                                .sorted(Comparator.comparingInt(DashboardResponse.DeptBreakdown::getIdeaCount)
                                                .reversed())
                                .collect(Collectors.toList());
        }
}