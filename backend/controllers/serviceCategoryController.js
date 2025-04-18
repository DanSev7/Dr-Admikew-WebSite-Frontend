const supabase = require('../config/database');

const serviceCategoryController = {
  async getAllServices(req, res) {
    try {
      const { data: services, error } = await supabase
        .from('service_categories')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (error) throw error;
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getServicesByCategory(req, res) {
    try {
      const { category } = req.params;
      const { data: services, error } = await supabase
        .from('service_categories')
        .select('*')
        .eq('category', category)
        .eq('is_active', true);

      if (error) throw error;
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async createService(req, res) {
    try {
      // Only admin can create services
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const { name, category, price, description } = req.body;
      const { data: service, error } = await supabase
        .from('service_categories')
        .insert([{ name, category, price, description }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(service);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateService(req, res) {
    try {
      // Only admin can update services
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const { id } = req.params;
      const { name, category, price, description, is_active } = req.body;
      
      const { data: service, error } = await supabase
        .from('service_categories')
        .update({ 
          name, 
          category, 
          price, 
          description, 
          is_active,
          updated_at: new Date()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = serviceCategoryController; 