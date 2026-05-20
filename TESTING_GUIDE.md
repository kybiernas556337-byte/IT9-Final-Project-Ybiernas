# Security Fixes - Testing & Verification Guide

## Overview
This document provides comprehensive testing procedures to verify all security fixes have been properly implemented.

---

## Test Suite 1: Race Condition Prevention

### Test 1.1: Single Order Placement
**Objective**: Verify basic order placement with stock reservation

**Steps**:
1. Login as customer
2. Navigate to shop
3. Add product with qty=5 to cart
4. Click "Place Order"
5. Verify order placed successfully

**Expected Results**:
- Order status = "pending"
- Product reserved_qty increased by 5
- Available qty displayed correctly

**SQL Verification**:
```sql
SELECT id, name, qty, reserved_qty, (qty - reserved_qty) as available 
FROM products 
WHERE id = [product_id];
```

---

### Test 1.2: Concurrent Order Submissions
**Objective**: Verify database locks prevent overselling

**Setup**:
- Product with qty = 10

**Steps**:
1. Open two browser windows, both logged in as different customers
2. Both add 7 units of same product to cart
3. Both attempt to place orders simultaneously
4. Observe results

**Expected Results**:
- One order succeeds, one fails with "Insufficient stock" error
- Total reserved_qty never exceeds available qty
- No race condition produces double-booking

---

### Test 1.3: Order Approval with Stock Check
**Objective**: Verify stock is properly deducted on approval

**Steps**:
1. Place order with 5 units of Product A
2. Verify reserved_qty = 5
3. Login as admin
4. Approve order
5. Check Product A stock

**Expected Results**:
- qty decreased from 100 to 95
- reserved_qty decreased from 5 to 0
- available_qty = 95

**SQL Verification**:
```sql
-- Check order status
SELECT id, user_id, status FROM orders WHERE id = [order_id];

-- Check product stock after approval
SELECT qty, reserved_qty, (qty - reserved_qty) as available FROM products WHERE id = [product_id];
```

---

## Test Suite 2: Stock Reservation System

### Test 2.1: Reserved Stock Not Available for Purchase
**Objective**: Verify customers cannot order already-reserved stock

**Setup**:
- Product A: qty = 10, reserved_qty = 8
- Available = 2

**Steps**:
1. Attempt to order 3 units of Product A as customer
2. Submit order

**Expected Results**:
- Order fails with "Insufficient stock" message
- Cart not cleared
- Can retry with qty=2 (which succeeds)

---

### Test 2.2: Rejected Order Releases Reserved Stock
**Objective**: Verify reservation is reversed on rejection

**Initial State**:
- Product B: qty = 50, reserved_qty = 0

**Steps**:
1. Customer A places order: qty = 20
2. Verify reserved_qty = 20
3. Admin rejects order
4. Verify stock status

**Expected Results**:
- qty = 50 (unchanged)
- reserved_qty = 0 (reversed)
- available_qty = 50 (back to full amount)

---

### Test 2.3: Shop Query Filters Correctly
**Objective**: Verify shop page only shows products with available stock

**Setup**:
- Product C: qty = 5, reserved_qty = 5 (available = 0)
- Product D: qty = 10, reserved_qty = 2 (available = 8)

**Steps**:
1. Login as customer
2. Visit shop page
3. Search for products C and D

**Expected Results**:
- Product C NOT visible in shop
- Product D visible in shop
- Message indicates product unavailable

---

## Test Suite 3: Access Control (RBAC)

### Test 3.1: Admin Dashboard Access
**Objective**: Verify only admins can access dashboard

**Test Cases**:
1. **Admin**: Navigate to `/dashboard`
   - Expected: ✅ Loads successfully
2. **Staff**: Navigate to `/dashboard`
   - Expected: ❌ 403 Forbidden
3. **Customer**: Navigate to `/dashboard`
   - Expected: ❌ 403 Forbidden

---

### Test 3.2: Admin Reports Access
**Objective**: Verify only admins can access reports

**Test Cases**:
1. **Admin**: Navigate to `/reports`
   - Expected: ✅ Loads successfully
2. **Staff**: Navigate to `/reports`
   - Expected: ❌ 403 Forbidden
3. **Customer**: Navigate to `/reports`
   - Expected: ❌ 403 Forbidden

---

### Test 3.3: Staff Records Access
**Objective**: Verify staff can access records but not dashboard

**Test Cases**:
1. **Staff**: Navigate to `/records`
   - Expected: ✅ Loads successfully
2. **Staff**: Navigate to `/dashboard`
   - Expected: ❌ 403 Forbidden

---

## Test Suite 4: Order Status Immutability

### Test 4.1: Cannot Re-update Approved Orders
**Objective**: Verify approved orders cannot be changed

**Steps**:
1. Place order and approve it (status = "approved")
2. As admin, attempt to update status to "rejected"
3. Submit form

**Expected Results**:
- Error message: "Can only update pending orders"
- Order status remains "approved"
- No state change occurs

**Test Alternative States**:
- Try updating rejected order → ❌ Error
- Try updating approved order → ❌ Error
- Only pending orders should accept updates → ✅

---

## Test Suite 5: Input Validation

### Test 5.1: Product Creation Validation
**Objective**: Verify field limits are enforced

**Test Cases**:
1. **Name**: Submit 256+ characters
   - Expected: ❌ Validation error: max 255
2. **Description**: Submit 1001+ characters
   - Expected: ❌ Validation error: max 1000
3. **Price**: Submit negative number
   - Expected: ❌ Validation error: min 0.01
4. **Qty**: Submit negative number
   - Expected: ❌ Validation error: min 0
5. **All fields valid**: Submit form
   - Expected: ✅ Product created

---

### Test 5.2: Order Quantity Validation
**Objective**: Verify order quantity limits

**Test Cases**:
1. **Qty = 0**: Attempt to place order
   - Expected: ❌ Validation error: min 1
2. **Qty = 10001**: Attempt to place order
   - Expected: ❌ Validation error: max 10000
3. **Qty = 5**: Attempt to place order
   - Expected: ✅ Order placed

---

## Test Suite 6: Product Deletion Safety

### Test 6.1: Delete Product with Pending Orders
**Objective**: Verify product deletion doesn't cascade

**Setup**:
1. Create Product X
2. Customer places order for Product X (order in pending status)
3. Admin navigates to products

**Steps**:
1. Delete Product X
2. Check order record

**Expected Results**:
- Product X deleted
- Order record still exists
- order_items.product_id = NULL for deleted product
- Order total/status preserved

**SQL Verification**:
```sql
-- Should show NULL product_id
SELECT id, order_id, product_id, qty, price 
FROM order_items 
WHERE order_id = [order_id];

-- Order should still exist
SELECT * FROM orders WHERE id = [order_id];
```

---

## Test Suite 7: Production Configuration

### Test 7.1: Debug Mode Disabled
**Objective**: Verify error messages don't expose stack traces

**Steps**:
1. Trigger an error (e.g., invalid SQL query)
2. Observe error output

**Expected Results**:
- ❌ NO stack traces displayed
- ❌ NO file paths shown
- ❌ NO database query details
- ✅ Generic error message shown
- ✅ Error logged to file

**Verification**:
```bash
# Check .env
grep "APP_DEBUG" .env  # Should show: APP_DEBUG=false
grep "APP_ENV" .env     # Should show: APP_ENV=production

# Check logs exist
tail -f storage/logs/laravel.log
```

---

## Test Suite 8: End-to-End Workflow

### Test 8.1: Complete Order Lifecycle
**Objective**: Verify entire flow with all security measures

**Scenario**: Customer orders, admin approves

**Steps**:
1. **Customer places order**:
   - Add 3 units of Product A to cart
   - Place order
   - Order created with status = "pending"

2. **Verify stock state**:
   - Product A: qty = 100, reserved = 3, available = 97

3. **Admin approves**:
   - Navigate to order management
   - Approve order

4. **Verify final state**:
   - Product A: qty = 97, reserved = 0, available = 97
   - Order status = "approved"

5. **Verify immutability**:
   - Attempt to change status again
   - Should fail

**Expected Results**: ✅ All steps pass

---

### Test 8.2: Complete Rejection Workflow
**Objective**: Verify rejected orders release reserved stock

**Scenario**: Customer orders, admin rejects

**Steps**:
1. **Customer places order**:
   - Add 5 units of Product B to cart
   - Place order

2. **Verify stock reserved**:
   - Product B: qty = 100, reserved = 5, available = 95

3. **Admin rejects**:
   - Navigate to orders
   - Reject order

4. **Verify stock released**:
   - Product B: qty = 100, reserved = 0, available = 100

5. **Customer re-orders**:
   - Can now order all 100 units (if stock allows)

**Expected Results**: ✅ All steps pass

---

## Performance Testing

### Test 9.1: Lock Timeout Handling
**Objective**: Verify locks don't cause indefinite hangs

**Steps**:
1. Simulate slow transaction (add sleep to code temporarily)
2. Attempt concurrent operations
3. Monitor timeout behavior

**Expected Results**:
- Transactions complete within reasonable time
- No deadlocks occur
- Queries log appropriately

---

## Security Testing Checklist

- [ ] Can customer place order exceeding available stock? **❌ NO**
- [ ] Can staff access admin dashboard? **❌ NO**
- [ ] Can rejected order be re-approved? **❌ NO**
- [ ] Can product be deleted without cascade? **✅ YES (NULL product_id)**
- [ ] Can debug errors leak sensitive info? **❌ NO**
- [ ] Do field validations prevent injection? **✅ YES**
- [ ] Can reserved stock be double-booked? **❌ NO**
- [ ] Are concurrent orders atomic? **✅ YES (transactions + locks)**

---

## Deployment Verification

After deploying to production:

```bash
# 1. Verify migrations applied
php artisan migrate:status

# 2. Check environment
grep "APP_DEBUG\|APP_ENV" .env

# 3. Test basic operation
php artisan tinker
>>> \App\Models\Product::first()->available_qty
>>> \App\Models\Order::first()

# 4. Monitor logs
tail -f storage/logs/laravel.log

# 5. Check database schema
php artisan tinker
>>> DB::select("SHOW COLUMNS FROM products WHERE Field='reserved_qty'")
```

---

## Rollback Procedures

If issues arise:

```bash
# Rollback last migration
php artisan migrate:rollback --step=1

# Restore from backup
# - Reserved_qty will be 0 for existing products
# - No data loss, system reverts to previous state
```

---

## Sign-off

- [ ] All 8 test suites completed
- [ ] No security issues found
- [ ] Performance acceptable
- [ ] Ready for production deployment

**Tested by**: _______________  
**Date**: _______________  
**Build Version**: _______________

