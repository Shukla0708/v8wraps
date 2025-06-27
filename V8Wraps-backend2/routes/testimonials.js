const express = require("express");
const { supabase } = require('../lib/supabase');
const router = express.Router();

router.get('/', async (req, res)=>{
    try {
      const { data, error } = await supabase
      .from('testimonials')
      .select('id, name, text, rating, created_at')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch testimonials' });
    }

    res.json({ testimonials: data });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: err.message });
  }
} );

// POST /api/testimonials
router.post('/forms', async (req, res) => {
  const { name, text, rating } = req.body;

  if (!name || !text || !rating) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const { data, error } = await supabase
    .from('testimonials')
    .insert([{ name, text, rating, is_approved: false }]);
    // .select();

  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ error: 'Failed to submit testimonial' });
  }

  res.status(200).json({ success: true, data });
});

// GET all testimonials (grouped)
router.get('/gettestimonials', async (req, res) => {
  try {
    const [pending, approved] = await Promise.all([
      supabase.from('testimonials').select('*').eq('is_approved', false).order('created_at', { ascending: false }),
      supabase.from('testimonials').select('*').eq('is_approved', true).order('created_at', { ascending: false })
    ]);
    if (pending.error || approved.error) {
      return res.status(500).json({ error: pending.error || approved.error });
    }

    res.json({ pending: pending.data, approved: approved.data });
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching testimonials' });
  }
});

// Approve
router.put('/:id/approve', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('testimonials').update({ is_approved: true }).eq('id', id);
  if (error) return res.status(500).json({ error });
  res.sendStatus(200);
});

// Unapprove
router.put('/:id/unapprove', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('testimonials').update({ is_approved: false }).eq('id', id);
  if (error){
    return res.status(500).json({ error });
  } 
  res.sendStatus(200);
});

// Delete (Reject)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) return res.status(500).json({ error });
  res.sendStatus(200);
});

module.exports = router;