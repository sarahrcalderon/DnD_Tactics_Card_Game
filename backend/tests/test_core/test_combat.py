import pytest

from core.combat import apply_destiny


def test_apply_destiny_azar():
    assert apply_destiny(6, 0.75) == 5


def test_apply_destiny_desfavoravel():
    assert apply_destiny(6, 0.90) == 6


def test_apply_destiny_normal():
    assert apply_destiny(6, 1.00) == 6


def test_apply_destiny_sorte():
    assert apply_destiny(6, 1.10) == 7


def test_apply_destiny_critico():
    assert apply_destiny(6, 1.25) == 8


def test_apply_destiny_accepts_float():
    assert apply_destiny(10.5, 1.10) == 12


def test_apply_destiny_rejects_negative_value():
    with pytest.raises(ValueError):
        apply_destiny(-1, 1.00)


def test_apply_destiny_rejects_negative_multiplier():
    with pytest.raises(ValueError):
        apply_destiny(6, -0.50)