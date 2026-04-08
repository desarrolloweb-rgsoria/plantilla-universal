// ============================================
// supabase-conector.js
// ============================================

const SUPABASE_URL = 'https://nvrcqlxnvjvhznmxozhh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_qCtRLmyJxBbYRcO7Suuqnw_mrmqspp6';

let miClienteSupabase = null;

function initSupabase() {
  if (miClienteSupabase) return miClienteSupabase;
  miClienteSupabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('✅ Supabase inicializado');
  return miClienteSupabase;
}

async function crearNegocio(datos) {
  const client = initSupabase();
  const { data, error } = await client
    .from('negocios')
    .insert([{
      cliente_nombre: datos.cliente_nombre,
      cliente_email: datos.cliente_email,
      cliente_telefono: datos.cliente_telefono,
      config: datos.config,
      estado: 'pendiente_revision'
    }])
    .select();
  if (error) throw error;
  return data[0];
}

async function getNegocio(id) {
  const client = initSupabase();
  const { data, error } = await client
    .from('negocios')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

async function getNegociosPendientes() {
  const client = initSupabase();
  const { data, error } = await client
    .from('negocios')
    .select('*')
    .in('estado', ['pendiente_revision', 'publicado'])
    .order('fecha_creacion', { ascending: false });
  if (error) throw error;
  return data;
}

async function actualizarNegocio(id, updates) {
  const client = initSupabase();
  const { data, error } = await client
    .from('negocios')
    .update({ ...updates, fecha_actualizacion: new Date() })
    .eq('id', id)
    .select();
  if (error) throw error;
  return data[0];
}

async function publicarNegocio(id) {
  return actualizarNegocio(id, { estado: 'publicado' });
}

// ============================================
// GALERÍA UNIFICADA
// ============================================
async function getImagenesPorCategoria(negocioId, categoria) {
  const client = initSupabase();
  let query = client.from('galeria').select('*').eq('negocio_id', negocioId);
  if (categoria !== 'todos') query = query.eq('categoria', categoria);
  const { data, error } = await query.order('orden');
  if (error) throw error;
  return data;
}

async function getTodasLasImagenes(negocioId) {
  const client = initSupabase();
  const { data, error } = await client
    .from('galeria')
    .select('*')
    .eq('negocio_id', negocioId)
    .order('categoria')
    .order('orden');
  if (error) throw error;
  return data;
}

async function guardarImagen(negocioId, imagen) {
  const client = initSupabase();
  const { data, error } = await client
    .from('galeria')
    .insert([{ ...imagen, negocio_id: negocioId }])
    .select();
  if (error) throw error;
  return data[0];
}

async function actualizarImagen(id, updates) {
  const client = initSupabase();
  const { error } = await client
    .from('galeria')
    .update(updates)
    .eq('id', id);
  if (error) throw error;
}

async function eliminarImagen(id) {
  const client = initSupabase();
  const { error } = await client
    .from('galeria')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ============================================
// PRODUCTOS
// ============================================
async function getProductosPorNegocio(negocioId) {
  const client = initSupabase();
  const { data, error } = await client
    .from('productos')
    .select('*')
    .eq('negocio_id', negocioId)
    .eq('disponible', true)
    .order('orden');
  if (error) throw error;
  return data;
}

async function guardarProducto(negocioId, producto) {
  const client = initSupabase();
  const { data, error } = await client
    .from('productos')
    .insert([{ ...producto, negocio_id: negocioId }])
    .select();
  if (error) throw error;
  return data[0];
}

async function actualizarProducto(id, updates) {
  const client = initSupabase();
  const { error } = await client
    .from('productos')
    .update(updates)
    .eq('id', id);
  if (error) throw error;
}

async function eliminarProducto(id) {
  const client = initSupabase();
  const { error } = await client
    .from('productos')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ============================================
// SERVICIOS
// ============================================
async function getServiciosPorNegocio(negocioId) {
  const client = initSupabase();
  const { data, error } = await client
    .from('servicios')
    .select('*')
    .eq('negocio_id', negocioId)
    .order('orden');
  if (error) throw error;
  return data;
}

async function guardarServicio(negocioId, servicio) {
  const client = initSupabase();
  const { data, error } = await client
    .from('servicios')
    .insert([{ ...servicio, negocio_id: negocioId }])
    .select();
  if (error) throw error;
  return data[0];
}

async function actualizarServicio(id, updates) {
  const client = initSupabase();
  const { error } = await client
    .from('servicios')
    .update(updates)
    .eq('id', id);
  if (error) throw error;
}

async function eliminarServicio(id) {
  const client = initSupabase();
  const { error } = await client
    .from('servicios')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ============================================
// TESTIMONIOS
// ============================================
async function getTestimoniosPorNegocio(negocioId) {
  const client = initSupabase();
  const { data, error } = await client
    .from('testimonios')
    .select('*')
    .eq('negocio_id', negocioId)
    .order('orden');
  if (error) throw error;
  return data;
}

async function guardarTestimonio(negocioId, testimonio) {
  const client = initSupabase();
  const { data, error } = await client
    .from('testimonios')
    .insert([{ ...testimonio, negocio_id: negocioId }])
    .select();
  if (error) throw error;
  return data[0];
}

async function actualizarTestimonio(id, updates) {
  const client = initSupabase();
  const { error } = await client
    .from('testimonios')
    .update(updates)
    .eq('id', id);
  if (error) throw error;
}

async function eliminarTestimonio(id) {
  const client = initSupabase();
  const { error } = await client
    .from('testimonios')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ============================================
// SOLICITUDES
// ============================================
async function guardarSolicitud(negocioId, solicitud) {
  const client = initSupabase();
  const { data, error } = await client
    .from('solicitudes')
    .insert([{ ...solicitud, negocio_id: negocioId }])
    .select();
  if (error) throw error;
  return data;
}

async function getSolicitudesPorNegocio(negocioId) {
  const client = initSupabase();
  const { data, error } = await client
    .from('solicitudes')
    .select('*')
    .eq('negocio_id', negocioId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// ============================================
// EXPORTAR
// ============================================
window.initSupabase = initSupabase;
window.crearNegocio = crearNegocio;
window.getNegocio = getNegocio;
window.getNegociosPendientes = getNegociosPendientes;
window.actualizarNegocio = actualizarNegocio;
window.publicarNegocio = publicarNegocio;
window.getImagenesPorCategoria = getImagenesPorCategoria;
window.getTodasLasImagenes = getTodasLasImagenes;
window.guardarImagen = guardarImagen;
window.actualizarImagen = actualizarImagen;
window.eliminarImagen = eliminarImagen;
window.getProductosPorNegocio = getProductosPorNegocio;
window.guardarProducto = guardarProducto;
window.actualizarProducto = actualizarProducto;
window.eliminarProducto = eliminarProducto;
window.getServiciosPorNegocio = getServiciosPorNegocio;
window.guardarServicio = guardarServicio;
window.actualizarServicio = actualizarServicio;
window.eliminarServicio = eliminarServicio;
window.getTestimoniosPorNegocio = getTestimoniosPorNegocio;
window.guardarTestimonio = guardarTestimonio;
window.actualizarTestimonio = actualizarTestimonio;
window.eliminarTestimonio = eliminarTestimonio;
window.guardarSolicitud = guardarSolicitud;
window.getSolicitudesPorNegocio = getSolicitudesPorNegocio;