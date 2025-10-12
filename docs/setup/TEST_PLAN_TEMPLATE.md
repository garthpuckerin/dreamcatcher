# Project Test Plan Template

Use this template to create test plans for all projects.

---

## Project Information
- **Project Name**: [Project Name]
- **Version**: [Version Number]
- **Last Updated**: [Date]
- **Test Owner**: [Name/Team]

---

## 1. Build Verification Tests (Pre-Commit Required) ⚠️

### 1.1 Dependency Installation
**Command**: [Installation command]
**Expected**: All dependencies install without errors

### 1.2 Build Compilation
**Command**: [Build command]
**Expected**: Build completes without errors

### 1.3 Development Server
**Command**: [Dev server command]
**Expected**: Server starts without errors

**Checklist**:
- [ ] Dependencies install
- [ ] Build succeeds
- [ ] Dev server starts
- [ ] No console errors

---

## 2. Runtime Tests (Pre-Commit Required) ⚠️

### 2.1 Application Load
**Test**: Navigate to application URL
**Expected**: Page loads without errors

### 2.2 Core Functionality
[List 3-5 core features that MUST work]

**Checklist**:
- [ ] App loads
- [ ] No JavaScript errors
- [ ] Core feature 1 works
- [ ] Core feature 2 works
- [ ] Core feature 3 works

---

## 3. Functional Tests

### 3.1 [Feature Area 1]
**Test Cases**:
- Test 3.1.1: [Test name]
  - Steps: [...]
  - Expected: [...]

### 3.2 [Feature Area 2]
**Test Cases**:
- Test 3.2.1: [Test name]
  - Steps: [...]
  - Expected: [...]

---

## 4. Integration Tests

[Tests for external services, APIs, databases]

---

## 5. Performance Tests

### 5.1 Load Time
**Expected**: [Page loads in < X seconds]

### 5.2 Responsiveness
**Expected**: [UI remains responsive under load]

---

## 6. Browser/Platform Compatibility

**Test on**:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Safari (latest)
- [ ] [Mobile browsers if applicable]

---

## 7. Security Tests (if applicable)

- [ ] Authentication works
- [ ] Authorization enforced
- [ ] Data isolation verified
- [ ] No sensitive data exposed

---

## Test Execution Requirements

### Before ANY Commit ⚠️
- [ ] Build verification tests pass
- [ ] Runtime tests pass
- [ ] No console errors
- [ ] Core functionality works

### Before Push to Main/Develop
- [ ] All functional tests pass
- [ ] Integration tests pass
- [ ] No linter errors
- [ ] Documentation updated

### Before Release
- [ ] All tests pass
- [ ] Performance acceptable
- [ ] Browser compatibility verified
- [ ] Security tests pass (if applicable)

---

## Failure Protocol

### If Tests Fail
1. ❌ **DO NOT COMMIT**
2. Fix the issue
3. Re-run all tests
4. ✅ Only commit when tests pass

### If Broken Code Was Committed
1. Create hotfix branch immediately
2. Fix the issue
3. Test thoroughly
4. Commit with `fix:` or `hotfix:` prefix
5. Document what was broken and how it was fixed

---

## Test Environment Setup

### Development Environment
```bash
[Setup commands]
```

### Testing Environment
```bash
[Setup commands]
```

---

## Test Data

[Describe test data sources, sample data, or test account setup]

---

## Automation (Future)

- [ ] Unit tests planned
- [ ] Integration tests planned
- [ ] E2E tests planned
- [ ] CI/CD pipeline configured

---

## Notes

[Project-specific notes, known issues, testing quirks]

---

**Template Version**: 1.0  
**Created**: 2025-10-12

