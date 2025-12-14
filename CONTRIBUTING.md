# Contributing to richardson

Thank you for your interest in improving this project! We welcome researchers, developers, and educators at all levels.

## 🎯 Core Values

- **Rigor**: Physics-informed, error-controlled solutions
- **Accessibility**: Clear documentation for students and practitioners
- **Reproducibility**: All results traceable and verifiable
- **Collaboration**: Open to diverse perspectives and expertise

## 🚀 Getting Started

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make changes** following the style guide below
4. **Add tests** for new functionality
5. **Submit a pull request** with a clear description

## 📝 Style Guide

### JavaScript/React
```javascript
// Use camelCase for variables and functions
const myFunction = () => { };

// Use descriptive names
const stabilityFunctionMomentum = (zeta, profile) => { };

// Add comments for complex logic
// Newton's method with numerical differentiation
const dz = 1e-8;
const df = (f(x + dz) - f(x - dz)) / (2 * dz);
```

### Python (coming soon)
```python
# Use PEP 8
def calculate_richardson_number(gradient_ri, profile='BD71'):
    """
    Convert gradient Richardson to bulk Richardson.

    Parameters
    ----------
    gradient_ri : float
        Gradient Richardson number
    profile : str
        MOST profile name ('BD71', 'HOG88', 'CB05')

    Returns
    -------
    float
        Bulk Richardson number
    """
    pass
```

### Documentation
- Use Markdown for all docs
- Include equations with LaTeX: `$\zeta = z/L$`
- Add examples and expected outputs
- Link to referenced papers with DOI when possible

## 🧪 Testing

### JavaScript
```bash
npm test
```

- Aim for 80%+ code coverage
- Test edge cases (ζ near singularities, extreme values)
- Include reference data validation

### Python (upcoming)
```bash
pytest tests/ --cov=richardson
```

## 📊 Adding New Features

### New Stability Profile Function
1. Add parameters to `profiles` object in MOST.js
2. Implement `phi_m(ζ)` and `phi_h(ζ)` functions
3. Add analytical or numerical `psi_m(ζ)` and `psi_h(ζ)`
4. Generate reference data and validate against literature
5. Add unit tests
6. Document in README with citations

**Example PR checklist:**
- [ ] New profile added with literature citation
- [ ] Conversion accuracy verified (< 1e-10 error)
- [ ] Reference table exported and spot-checked
- [ ] Tests added for stability functions
- [ ] Documentation updated with equations

### New Conversion Tool
1. Implement the conversion algorithm
2. Include numerical stability checks
3. Test against known analytical solutions
4. Document assumptions and limitations
5. Add to parameter conversion interface

## 🔍 Code Review Process

**All PRs require:**
1. ≥ 1 approval from maintainers
2. Passing CI tests
3. Updated documentation
4. Clear commit messages

**Review criteria:**
- Correctness of physics/mathematics
- Code readability and maintainability
- Test coverage (new code only)
- Performance (no unnecessary overhead)

## 📚 Documentation Standards

### README updates
- Explain *why* the feature matters
- Provide usage examples
- Include expected outputs
- Link to relevant theory/papers

### Docstrings (Python)
```python
def convert_rig_to_zeta(rig_target, profile='BD71', initial_guess=0.1):
    """
    Invert gradient Richardson number to find ζ using Newton's method.

    Uses dimensionless height ζ = z/L where L is Monin-Obukhov length.
    Achieves 10⁻¹⁰ relative tolerance with robust bounds checking.

    Parameters
    ----------
    rig_target : float
        Target gradient Richardson number (typically -10 < Ri_g < 1)
    profile : str, optional
        MOST profile: 'BD71' (default), 'HOG88', 'CB05'
    initial_guess : float, optional
        Starting ζ for Newton iteration (default 0.1)

    Returns
    -------
    float
        Dimensionless height ζ = z/L

    Raises
    ------
    ValueError
        If Ri_g is outside physically meaningful range
    ConvergenceError
        If Newton's method fails to converge

    Notes
    -----
    Newton's method with numerical differentiation (dz = 1e-8).
    Bounded to [-10, 10] to prevent unphysical solutions.

    References
    ----------
    Businger et al. (1971): Flux-profile relationships in the
    atmospheric surface layer. J. Atmos. Sci., 28, 181–189.

    Examples
    --------
    >>> zeta = convert_rig_to_zeta(0.01, profile='BD71')
    >>> print(f"{zeta:.6f}")
    0.000156
    """
    pass
```

## 🐛 Reporting Issues

Use GitHub Issues with the template:

```markdown
### Description
Brief summary of the issue

### Expected Behavior
What should happen?

### Actual Behavior
What actually happens?

### Steps to Reproduce
1. Open MOST tool
2. Select profile 'CB05'
3. Set ζ = 0.5
4. [Issue occurs]

### Environment
- Browser: Chrome 120
- OS: macOS 14.1
- React: v18.2

### References
- Link to related issue or paper
```

## 📖 Citing This Work

If you use richardson in your research, please cite:

```bibtex
@software{england2024richardson,
  title={richardson: Canonical Reference Tools for ABL Stability},
  author={England, David E.},
  year={2024},
  url={https://github.com/DavidEngland/richardson}
}
```

## ❓ Questions?

- **General questions**: GitHub Discussions
- **Bug reports**: GitHub Issues
- **Direct contact**: david.england@uah.edu

---

**Thank you for contributing!** 🙏