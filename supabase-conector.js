// ============================================
// supabase-conector.js
// ============================================

let miClienteSupabase = null;

function initSupabase(url, key) {
    if (miClienteSupabase) return miClienteSupabase;
    miClienteSupabase = supabase.createClient(url, key);
    console.log('✅ Supabase inicializado');
    return miClienteSupabase;
}

// ============================================
// CLIENTES (nueva tabla unificada)
// ============================================

async function crearCliente(datos, supabaseUrl, supabaseKey) {
    const client = initSupabase(supabaseUrl, supabaseKey);
    
    // Generar ID público RGS-XXXX
    const numero = Math.floor(Math.random() * 9000 + 1000);
    const idPublico = `RGS-${numero}`;
    
    const { data, error } = await client
        .from('clientes')
        .insert([{
            id_publico: idPublico,
            nombre: datos.nombre,
            email: datos.email,
            telefono: datos.telefono,
            password: datos.password || 'admin',
            config: datos.config || {},
            estado: 'pendiente_revision'
        }])
        .select();
    if (error) throw error;
    return data[0];
}

async function getClientePorIdPublico(idPublico, supabaseUrl, supabaseKey) {
    const client = initSupabase(supabaseUrl, supabaseKey);
    const { data, error } = await client
        .from('clientes')
        .select('*')
        .eq('id_publico', idPublico)
        .single();
    if (error) throw error;
    return data;
}

async function getClientePorUUID(uuid, supabaseUrl, supabaseKey) {
    const client = initSupabase(supabaseUrl, supabaseKey);
    const { data, error } = await client
        .from('clientes')
        .select('*')
        .eq('uuid', uuid)
        .single();
    if (error) throw error;
    return data;
}

async function getTodosClientes(supabaseUrl, supabaseKey) {
    const client = initSupabase(supabaseUrl, supabaseKey);
    const { data, error } = await client
        .from('clientes')
        .select('*')
        .order('fecha_creacion', { ascending: false });
    if (error) throw error;
    return data;
}

async function actualizarCliente(idPublico, updates, supabaseUrl, supabaseKey) {
    const client = initSupabase(supabaseUrl, supabaseKey);
    const { data, error } = await client
        .from('clientes')
        .update({ ...updates, fecha_actualizacion: new Date() })
        .eq('id_publico', idPublico)
        .select();
    if (error) throw error;
    return data[0];
}

async function publicarCliente(idPublico, supabaseUrl, supabaseKey) {
    return actualizarCliente(idPublico, { estado: 'publicado' }, supabaseUrl, supabaseKey);
}

async function loginCliente(idPublico, password, supabaseUrl, supabaseKey) {
    const client = initSupabase(supabaseUrl, supabaseKey);
    const { data, error } = await client
        .from('clientes')
        .select('*')
        .eq('id_publico', idPublico)
        .single();
    if (error) throw error;
    if (data.password !== password) throw new Error('Contraseña incorrecta');
    return data;
}

// ============================================
// PRODUCTOS
// ============================================
async function getProductosPorCliente(clienteUUID, supabaseUrl, supabaseKey) {
    const client = initSupabase(supabaseUrl, supabaseKey);
    const { data, error } = await client
        .from('productos_cliente')
        .select('*')
        .eq('cliente_uuid', clienteUUID)
        .eq('disponible', true)
        .order('orden');
    if (error) throw error;
    return data;
}

async function guardarProducto(clienteUUID, producto, supabaseUrl, supabaseKey) {
    const client = initSupabase(supabaseUrl, supabaseKey);
    const { data, error } = await client
        .from('productos_cliente')
        .insert([{ ...producto, cliente_uuid: clienteUUID }])
        .select();
    if (error) throw error;
    return data[0];
}

async function actualizarProducto(id, updates, supabaseUrl, supabaseKey) {
    const client = initSupabase(supabaseUrl, supabaseKey);
    const { error } = await client
        .from('productos_cliente')
        .update(updates)
        .eq('id', id);
    if (error) throw error;
}

async function eliminarProducto(id, supabaseUrl, supabaseKey) {
    const client = initSupabase(supabaseUrl, supabaseKey);
    const { error } = await client
        .from('productos_cliente')
        .delete()
        .eq('id', id);
    if (error) throw error;
}

// ============================================
// SERVICIOS
// ============================================
async function getServiciosPorCliente(clienteUUID, supabaseUrl, supabaseKey) {
    const client = initSupabase(supabaseUrl, supabaseKey);
    const { data, error } = await client
        .from('servicios_cliente')
        .select('*')
        .eq('cliente_uuid', clienteUUID)
        .order('orden');
    if (error) throw error;
    return data;
}

async function guardarServicio(clienteUUID, servicio, supabaseUrl, supabaseKey) {
    const client = initSupabase(supabaseUrl, supabaseKey);
    const { data, error } = await client
        .from('servicios_cliente')
        .insert([{ ...servicio, cliente_uuid: clienteUUID }])
        .select();
    if (error) throw error;
    return data[0];
}

async function actualizarServicio(id, updates, supabaseUrl, supabaseKey) {
    const client = initSupabase(supabaseUrl, supabaseKey);
    const { error } = await client
        .from('servicios_cliente')
        .update(updates)
        .eq('id', id);
    if (error) throw error;
}

async function eliminarServicio(id, supabaseUrl, supabaseKey) {
    const client = initSupabase(supabaseUrl, supabaseKey);
    const { error } = await client
        .from('servicios_cliente')
        .delete()
        .eq('id', id);
    if (error) throw error;
}

// ============================================
// GALERÍA
// ============================================
async function getGaleriaPorCliente(clienteUUID, supabaseUrl, supabaseKey) {
    const client = initSupabase(supabaseUrl, supabaseKey);
    const { data, error } = await client
        .from('galeria_cliente')
        .select('*')
        .eq('cliente_uuid', clienteUUID)
        .order('orden');
    if (error) throw error;
    return data;
}

async function guardarImagenGaleria(clienteUUID, imagen, supabaseUrl, supabaseKey) {
    const client = initSupabase(supabaseUrl, supabaseKey);
    const { data, error } = await client
        .from('galeria_cliente')
        .insert([{ ...imagen, cliente_uuid: clienteUUID }])
        .select();
    if (error) throw error;
    return data[0];
}

async function actualizarImagenGaleria(id, updates, supabaseUrl, supabaseKey) {
    const client = initSupabase(supabaseUrl, supabaseKey);
    const { error } = await client
        .from('galeria_cliente')
        .update(updates)
        .eq('id', id);
    if (error) throw error;
}

async function eliminarImagenGaleria(id, supabaseUrl, supabaseKey) {
    const client = initSupabase(supabaseUrl, supabaseKey);
    const { error } = await client
        .from('galeria_cliente')
        .delete()
        .eq('id', id);
    if (error) throw error;
}

// ============================================
// TESTIMONIOS
// ============================================
async function getTestimoniosPorCliente(clienteUUID, supabaseUrl, supabaseKey) {
    const client = initSupabase(supabaseUrl, supabaseKey);
    const { data, error } = await client
        .from('testimonios_cliente')
        .select('*')
        .eq('cliente_uuid', clienteUUID)
        .order('orden');
    if (error) throw error;
    return data;
}

async function guardarTestimonio(clienteUUID, testimonio, supabaseUrl, supabaseKey) {
    const client = initSupabase(supabaseUrl, supabaseKey);
    const { data, error } = await client
        .from('testimonios_cliente')
        .insert([{ ...testimonio, cliente_uuid: clienteUUID }])
        .select();
    if (error) throw error;
    return data[0];
}

async function actualizarTestimonio(id, updates, supabaseUrl, supabaseKey) {
    const client = initSupabase(supabaseUrl, supabaseKey);
    const { error } = await client
        .from('testimonios_cliente')
        .update(updates)
        .eq('id', id);
    if (error) throw error;
}

async function eliminarTestimonio(id, supabaseUrl, supabaseKey) {
    const client = initSupabase(supabaseUrl, supabaseKey);
    const { error } = await client
        .from('testimonios_cliente')
        .delete()
        .eq('id', id);
    if (error) throw error;
}

// ============================================
// SOLICITUDES
// ============================================
async function guardarSolicitud(clienteUUID, solicitud, supabaseUrl, supabaseKey) {
    const client = initSupabase(supabaseUrl, supabaseKey);
    const { data, error } = await client
        .from('solicitudes_cliente')
        .insert([{ ...solicitud, cliente_uuid: clienteUUID }])
        .select();
    if (error) throw error;
    return data;
}

async function getSolicitudesPorCliente(clienteUUID, supabaseUrl, supabaseKey) {
    const client = initSupabase(supabaseUrl, supabaseKey);
    const { data, error } = await client
        .from('solicitudes_cliente')
        .select('*')
        .eq('cliente_uuid', clienteUUID)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}

// ============================================
// UTILIDADES
// ============================================
function getImagenUrl(supabaseUrl, bucketName, clienteUUID, carpeta, nombreArchivo) {
    if (!nombreArchivo) return '';
    if (nombreArchivo.includes('/')) {
        return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${clienteUUID}/${nombreArchivo}`;
    }
    return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${clienteUUID}/${carpeta}/${nombreArchivo}`;
}

// Exportar
window.initSupabase = initSupabase;
window.crearCliente = crearCliente;
window.getClientePorIdPublico = getClientePorIdPublico;
window.getClientePorUUID = getClientePorUUID;
window.getTodosClientes = getTodosClientes;
window.actualizarCliente = actualizarCliente;
window.publicarCliente = publicarCliente;
window.loginCliente = loginCliente;
window.getProductosPorCliente = getProductosPorCliente;
window.guardarProducto = guardarProducto;
window.actualizarProducto = actualizarProducto;
window.eliminarProducto = eliminarProducto;
window.getServiciosPorCliente = getServiciosPorCliente;
window.guardarServicio = guardarServicio;
window.actualizarServicio = actualizarServicio;
window.eliminarServicio = eliminarServicio;
window.getGaleriaPorCliente = getGaleriaPorCliente;
window.guardarImagenGaleria = guardarImagenGaleria;
window.actualizarImagenGaleria = actualizarImagenGaleria;
window.eliminarImagenGaleria = eliminarImagenGaleria;
window.getTestimoniosPorCliente = getTestimoniosPorCliente;
window.guardarTestimonio = guardarTestimonio;
window.actualizarTestimonio = actualizarTestimonio;
window.eliminarTestimonio = eliminarTestimonio;
window.guardarSolicitud = guardarSolicitud;
window.getSolicitudesPorCliente = getSolicitudesPorCliente;
window.getImagenUrl = getImagenUrl;
