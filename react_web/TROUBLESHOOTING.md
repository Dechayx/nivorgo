# Troubleshooting Quick View and Checkout Issues

## Problem
- Quick View button not working when hovering over products
- Proceed to Checkout button not showing the modal

## Possible Causes & Solutions

### 1. **Product Hover Buttons Not Visible**

**Issue:** The Quick View and Add to Cart buttons appear on hover but might not be visible.

**Solution:** Check if you can see the buttons when hovering over product images.

**CSS Fix (if needed):**
The buttons should appear at the bottom of the product card on hover. If they don't:
- The CSS is in `index.css` lines 96-113
- Make sure `.product-card:hover .product-actions` shows `opacity: 1`

**Manual Test:**
1. Hover slowly over a product image
2. Look at the bottom of the image - two buttons should slide up
3. Click "Quick View" or "Add to Cart"

### 2. **Bootstrap Not Loaded**

**Check in Browser Console (F12):**
```javascript
console.log(window.bootstrap)
```
Should show an object, not `undefined`.

**If undefined:** Bootstrap isn't loaded. Check that you imported it in App.jsx:
```javascript
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
```

### 3. **Alternative Ways to Test**

**For Quick View:**
1. Open browser console (F12)
2. Add an item to cart first (this we know works)
3. Then check if the modal opens

**For Checkout:**
1. Add items to cart
2. Click cart icon (👜)
3. Cart sidebar should open
4. Click "PROCEED TO CHECKOUT"
5. Wait 300ms - modal should appear

### 4. **Direct Browser Test**

Open browser console and run:
```javascript
// Test if modals exist
document.getElementById('quickViewModal')
document.getElementById('checkoutModal')
document.getElementById('cartOffcanvas')

// Test Bootstrap
new bootstrap.Modal(document.getElementById('quickViewModal')).show()
```

## Quick Fixes Applied

1. ✅ Added 300ms delay for checkout modal
2. ✅ Added 100ms delay for quick view modal
3. ✅ Added error handling for missing Bootstrap

## If Still Not Working

### Option 1: Check Browser Console
1. Press F12
2. Go to Console tab
3. Look for errors (red text)
4. Share any errors you see

### Option 2: Test with Direct URL
Instead of clicking buttons, try:
- Products: Already on home page, scroll down
- Checkout: Add item to cart, click bag icon
- Quick View: Hover over product card

### Option 3: Verify Swiper Working
The products are in a Swiper slider. If you can:
- See the products
- Navigate left/right with arrows
- Swiper is working

Then the button issue is CSS/hover related.

## What Should Happen

**Quick View (on product hover):**
1. Hover over product image
2. Image zooms slightly
3. Two buttons slide up from bottom
4. Click "Quick View"
5. Modal opens with product details

**Checkout:**
1. Add item(s) to cart
2. Click bag icon (👜) in navbar
3. Sidebar opens from right
4. Shows your items
5. Click "PROCEED TO CHECKOUT"
6. Sidebar closes
7. After 300ms, modal opens asking for address

## Browser Compatibility
- Chrome: ✅ Should work
- Firefox: ✅ Should work
- Edge: ✅ Should work
- Safari: ⚠️ May need testing

## Next Steps

Try opening the app and:
1. Hover over a product - can you see buttons?
2. Click cart icon - does sidebar open?
3. Check browser console for errors

Let me know which step fails!
