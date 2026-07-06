# Security Specification: WeCare Hospitals Firebase Integration

This document defines the security rules and data invariants for our Firestore database, following the payload-first security Test-Driven Development (TDD) guidelines.

## 1. Data Invariants

1. **User Invariant**: A user document under `/users/{userId}` can only be created or updated if its document ID matches the authenticated user's UID (`request.auth.uid`).
2. **Booking Ownership Invariant**: A booking under `/bookings/{bookingId}` must have a `userId` field matching the authenticated user's UID (`request.auth.uid`). No user can read or write another user's bookings.
3. **Status Immutability Invariant**: A booking's status can only be updated from `'Confirmed'` to `'Cancelled'`. Once `'Cancelled'`, the document becomes terminal and cannot be further updated.
4. **Timestamp Integrity**: All `createdAt` fields must match `request.time` exactly on creation.
5. **Strict Schema Constraints**: No shadow fields are allowed. Map structures are validated for exact key counts and field types.

---

## 2. The "Dirty Dozen" Vulnerability Payloads

Below are twelve malicious payloads designed to attempt breaches of Identity, Integrity, and State:

1. **Anonymous Write Attack**: Creating a booking while not logged in.
2. **Identity Spoofing (User ID)**: Creating a booking with `userId: "attacker_uid"` but authenticated as `victim_uid`.
3. **Privilege Escalation**: Attempting to set an unverified field `role: "admin"` in user profiles.
4. **Ghost Field Injection (Shadow Update)**: Appending `isVip: true` or `discountCode: "FREE"` to a standard booking document.
5. **ID Poisoning (Resource Exhaustion)**: Creating a document with a 1.5KB junk-character ID string (e.g., `WCH-%%%%...%%%%`).
6. **Value Poisoning (Status)**: Writing a random string like `"FakeConfirmed"` or a 1MB value to the `status` field.
7. **Terminal State Bypass**: Attempting to reschedule or modify a booking that already has a status of `'Cancelled'`.
8. **Client Timestamp Spoofing**: Setting `createdAt` to a custom back-dated/future-dated timestamp from the client instead of `request.time`.
9. **Blanket Query Reading**: A client querying all bookings `/bookings` without filtering by their own `userId`.
10. **PII Exposure Attack**: Attempting to fetch another user's user profile document under `/users/{victimUid}`.
11. **Immutability Breach**: Attempting to alter the immutable fields `createdAt` or `doctorId` on an existing booking.
12. **Orphaned Booking Write**: Attempting to register a booking with a non-existent or malformed `departmentId`.

---

## 3. Test Runner Design

All "Dirty Dozen" operations must fail with `PERMISSION_DENIED` under our security design:

- **Create User Verification**: `auth.uid == userId` and `request.resource.data.keys().hasAll(['uid', 'email', 'displayName', 'createdAt'])`.
- **Create Booking Verification**: `request.auth != null`, `request.resource.data.userId == request.auth.uid`, `request.resource.data.status == 'Confirmed'`, and `request.resource.data.createdAt == request.time`.
- **Update Booking Verification**: Can only transition `status` to `'Cancelled'` where `existing().status == 'Confirmed'` and no other fields are changed.
