"""Backend API tests for Sentra Cendekia."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://sentra-cendekia.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"
ADMIN_EMAIL = "admin@sentracendekia.id"
ADMIN_PASSWORD = "SentraAdmin2026!"


@pytest.fixture(scope="session")
def token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, f"Login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "access_token" in data and "user" in data
    assert data["user"]["email"] == ADMIN_EMAIL
    return data["access_token"]


@pytest.fixture
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


# ---------- Public content ----------
class TestPublicContent:
    def test_get_content_has_seeded_data(self):
        r = requests.get(f"{API}/content", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert "settings" in data
        assert len(data["programs"]) >= 4
        assert len(data["tutors"]) >= 3
        assert len(data["packages"]) >= 4
        assert len(data["faqs"]) >= 5
        assert data["settings"]["brand_name"] == "Sentra Cendekia"

    def test_get_settings(self):
        r = requests.get(f"{API}/settings", timeout=15)
        assert r.status_code == 200
        assert "hero_title" in r.json()


# ---------- Auth ----------
class TestAuth:
    def test_wrong_password(self):
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrongpass"}, timeout=15)
        assert r.status_code in (401, 429)

    def test_me_requires_auth(self):
        r = requests.get(f"{API}/auth/me", timeout=15)
        assert r.status_code == 401

    def test_me_with_bearer(self, auth_headers):
        r = requests.get(f"{API}/auth/me", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL

    def test_unauth_create_program(self):
        r = requests.post(f"{API}/programs", json={"title": "X"}, timeout=15)
        assert r.status_code == 401


# ---------- Admin CRUD ----------
class TestCRUD:
    @pytest.mark.parametrize("coll,payload,update", [
        ("programs", {"title": "TEST_prog", "level": "SMP"}, {"title": "TEST_prog_upd", "level": "SMA"}),
        ("tutors", {"name": "TEST_tutor", "subject": "Math"}, {"name": "TEST_tutor_upd", "subject": "Phy"}),
        ("packages", {"name": "TEST_pkg", "sessions": 3, "price": 100000}, {"name": "TEST_pkg_upd", "sessions": 5, "price": 200000}),
        ("faqs", {"question": "TEST_q?", "answer": "A"}, {"question": "TEST_q_upd?", "answer": "B"}),
    ])
    def test_crud_flow(self, auth_headers, coll, payload, update):
        # Create
        r = requests.post(f"{API}/{coll}", json=payload, headers=auth_headers, timeout=15)
        assert r.status_code == 200, r.text
        item_id = r.json()["id"]

        # Verify in /content
        content = requests.get(f"{API}/content", timeout=15).json()
        assert any(it["id"] == item_id for it in content[coll])

        # Update
        r = requests.put(f"{API}/{coll}/{item_id}", json=update, headers=auth_headers, timeout=15)
        assert r.status_code == 200
        # Confirm update
        content = requests.get(f"{API}/content", timeout=15).json()
        item = next(it for it in content[coll] if it["id"] == item_id)
        for k, v in update.items():
            assert item[k] == v

        # Delete
        r = requests.delete(f"{API}/{coll}/{item_id}", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        # Confirm deleted
        r = requests.delete(f"{API}/{coll}/{item_id}", headers=auth_headers, timeout=15)
        assert r.status_code == 404


# ---------- Settings update ----------
class TestSettings:
    def test_update_settings_persists(self, auth_headers):
        current = requests.get(f"{API}/settings", timeout=15).json()
        original_badge = current["hero_badge"]
        current["hero_badge"] = "TEST_BADGE_XYZ"
        r = requests.put(f"{API}/settings", json=current, headers=auth_headers, timeout=15)
        assert r.status_code == 200
        after = requests.get(f"{API}/settings", timeout=15).json()
        assert after["hero_badge"] == "TEST_BADGE_XYZ"
        # Restore
        current["hero_badge"] = original_badge
        requests.put(f"{API}/settings", json=current, headers=auth_headers, timeout=15)


# ---------- Registrations ----------
class TestRegistrations:
    def test_registration_flow(self, auth_headers):
        payload = {"name": "TEST_User", "phone": "081234567890", "level": "SMA",
                   "program": "Les Privat SMA & UTBK", "package": "Paket Reguler", "message": "test"}
        r = requests.post(f"{API}/registrations", json=payload, timeout=15)
        assert r.status_code == 200
        reg_id = r.json()["id"]
        assert r.json()["status"] == "baru"

        # List
        r = requests.get(f"{API}/registrations", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        assert any(it["id"] == reg_id for it in r.json())

        # Patch status
        r = requests.patch(f"{API}/registrations/{reg_id}", json={"status": "dihubungi"},
                           headers=auth_headers, timeout=15)
        assert r.status_code == 200
        listed = requests.get(f"{API}/registrations", headers=auth_headers, timeout=15).json()
        assert next(it for it in listed if it["id"] == reg_id)["status"] == "dihubungi"

        # Summary
        r = requests.get(f"{API}/admin/summary", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        summary = r.json()
        assert "counts" in summary and "registrations" in summary["counts"]

        # Delete
        r = requests.delete(f"{API}/registrations/{reg_id}", headers=auth_headers, timeout=15)
        assert r.status_code == 200

    def test_registrations_requires_auth(self):
        assert requests.get(f"{API}/registrations", timeout=15).status_code == 401
