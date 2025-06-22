const express = require('express');
const { supabase } = require('../lib/supabase');
const {authenticateToken} = require('../lib/middleware')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const { v2: cloudinary } = require('cloudinary');
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET /api/images/categories - Get all categories (MUST be before /:id routes)
router.get('/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('images')
      .select('category')
      .not('category', 'is', null);

    if (error) throw error;
    
    const categories = [...new Set(data.map(item => item.category))];
    res.status(200).json(['All', ...categories]);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

// GET /api/images - Get all images
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = supabase
      .from('images')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Failed to fetch images' });
  }
});

// POST /api/images - Create new image
router.post('/', authenticateToken ,async (req, res) => {
  try {
    const imageData = req.body;

    const { data, error } = await supabase
      .from('images')
      .insert([imageData])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error creating image:', error);
    res.status(500).json({ message: 'Failed to create image' });
  }
});

// PUT /api/images/:id - Update image
router.put('/:id', authenticateToken ,async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate ID parameter
    if (!id) {
      return res.status(400).json({ message: 'Image ID is required' });
    }

    const { data, error } = await supabase
      .from('images')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();

    if (error) throw error;

    if (data.length === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.status(200).json(data[0]);
  } catch (error) {
    console.error('Error updating image:', error);
    res.status(500).json({ message: 'Failed to update image' });
  }
});

// DELETE /api/images/:id - Delete image
router.delete('/:id', authenticateToken ,async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID parameter
    if (!id) {
      return res.status(400).json({ message: 'Image ID is required' });
    }

    const { error } = await supabase
      .from('images')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Failed to delete image' });
  }
});

// router.post('/cloudinary', upload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     const filePath = req.file.path;

//     // Create FormData properly for Node.js
//     const form = new FormData();
//     form.append('file', fs.createReadStream(filePath));
//     form.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET);
//     form.append('folder', 'gallery');

//     console.log('Uploading to Cloudinary...');

//     const cloudinaryResponse = await fetch(
//       `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
//       {
//         method: 'POST',
//         body: form,
//         headers: form.getHeaders(), // This is crucial for form-data
//       }
//     );

//     console.log('Cloudinary response status:', cloudinaryResponse.status);

//     if (!cloudinaryResponse.ok) {
//       const errorText = await cloudinaryResponse.text();
//       console.error('Cloudinary error:', errorText);
//       throw new Error(`Failed to upload image: ${errorText}`);
//     }

//     const data = await cloudinaryResponse.json();
//     console.log('Upload successful:', data.public_id);

//     // Clean up uploaded file
//     fs.unlink(filePath, (err) => {
//       if (err) console.error('Error deleting temp file:', err);
//     });

//     res.status(200).json(data);
//   } catch (error) {
//     console.error('Error uploading image:', error);
    
//     // Clean up uploaded file in case of error
//     if (req.file && req.file.path) {
//       fs.unlink(req.file.path, (err) => {
//         if (err) console.error('Error deleting temp file:', err);
//       });
//     }
    
//     res.status(500).json({ 
//       message: 'Failed to upload image',
//       error: error.message 
//     });
//   }
// });

//delete images from coudinary
router.post('/delete-cloudinary-image', authenticateToken ,async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({ message: 'Public ID is required' });
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      return res.status(200).json({ 
        message: 'Image deleted successfully',
        result: result 
      });
    } else {
      return res.status(400).json({ 
        message: 'Failed to delete image from Cloudinary',
        result: result 
      });
    }
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

module.exports = router;