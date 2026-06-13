# Image Upload Setup

## Pipeline

Image requests use `multipart/form-data`:

1. Multer validates each file and writes it to `backend/temp/`.
2. The upload service sends files to Cloudinary.
3. Temporary files are removed after upload or when the request fails.
4. Only Cloudinary `secure_url` values are stored in MongoDB.
5. Partial Cloudinary uploads are rolled back when another upload or the database write fails.

Supported formats are JPG, JPEG, PNG, and WebP. Each image is limited to 5MB.
Products support up to 10 images, bookings up to 5 images, and technician CNIC uploads one image.

## Cloudinary Credentials

1. Create or sign in to a Cloudinary account at https://cloudinary.com/.
2. Open the Cloudinary Console.
3. Select the required product environment.
4. Copy the Cloud Name and API Key from the API Keys page.
5. Reveal and copy the API Secret. Keep this value server-side and never commit it.

Add these values to `backend/.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Restart the backend after changing environment variables.

## API Fields

- Product create/update: `images` (multiple files)
- Product update: `existingImages` (JSON array of current URLs to retain)
- Technician create/update: `cnicImage` (single file)
- Booking create: `images` (multiple files)

Other text, number, boolean, array, and nested-object fields are sent in the same multipart request.

## Testing

1. Configure valid Cloudinary credentials in `backend/.env`.
2. Start the backend with `npm run dev` from `backend/`.
3. Start the frontend with `npm run dev` from `frontend/`.
4. Create a product with several valid images and confirm the returned `images` array contains HTTPS Cloudinary URLs.
5. Edit the product, remove one existing image, add another, and confirm rendering still uses the returned URL array.
6. Create or edit a technician with a CNIC image and confirm `cnicImage` is a Cloudinary URL.
7. Create a booking with several problem images and confirm they appear in customer and admin booking details.
8. Verify rejection behavior with a non-image file, a file larger than 5MB, and too many files.
9. Confirm `backend/temp/` is empty after both successful and failed requests.
