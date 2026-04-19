import fs from 'fs';

const file = 'src/pages/admin/CMS.tsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `  const handleFileUpload = async (moduleId: string, file: File) => {
    if (!file) return;
    try {
      setUploading(moduleId);
      const isVideo = file.type.startsWith('video/');
      const folder = isVideo ? 'videos' : 'images';
      
      if (isVideo && file.size > 50 * 1024 * 1024) {
         alert("Video exceeds 50MB limit. Please compress your asset.");
         setUploading(null);
         return;
      }

      if (!isVideo && file.size > 20 * 1024 * 1024) {
         alert("Image exceeds 20MB High-Definition limit. Please compress out of bounds vectors.");
         setUploading(null);
         return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = \`\${Math.random().toString(36).substring(2)}-\${Date.now()}.\${fileExt}\`;
      const filePath = \`\${folder}/\${fileName}\`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
         if (uploadError.message.includes('Bucket not found') || uploadError.message.includes('row-level security') || uploadError.message.includes('Violates')) {
            alert("System Requirement: Please log into your Supabase Dashboard, create a new Storage Bucket named 'media', and set it to 'Public'.");
         } else {
            alert(\`Storage Error: \${uploadError.message}\`);
         }
         setUploading(null);
         return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      updateModuleContent(moduleId, 'media_url', publicUrlData.publicUrl);
      updateModuleContent(moduleId, 'media_type', isVideo ? 'video' : 'image');
      setUploading(null);
    } catch (error: any) {
      alert('Error processing file: ' + error.message);
      setUploading(null);
    }
  };

  const handleGridFileUpload = async (moduleId: string, itemIdx: number, file: File) => {
    if (!file) return;
    try {
      setUploading(\`\${moduleId}-\${itemIdx}\`);

      if (file.size > 15 * 1024 * 1024) {
         alert("Image exceeds 15MB limit. Please compress out of bounds files.");
         setUploading(null);
         return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = \`\${Math.random().toString(36).substring(2)}-\${Date.now()}.\${fileExt}\`;
      const filePath = \`images/grids/\${fileName}\`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
         alert(\`Storage Error: \${uploadError.message}\`);
         setUploading(null);
         return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);
      
      setModules(prev => prev.map(m => {
        if (m.id === moduleId && m.grid_items) {
           const newItems = [...m.grid_items];
           newItems[itemIdx] = { ...newItems[itemIdx], img: publicUrlData.publicUrl };
           return { ...m, grid_items: newItems };
        }
        return m;
      }));
      setUploading(null);
    } catch (error: any) {
      alert('Error processing file: ' + error.message);
      setUploading(null);
    }
  };`;

const startIndex = content.indexOf('  const handleFileUpload = async');
const endIndex = content.indexOf('  return (', startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + replacement + '\n\n' + content.substring(endIndex);
  fs.writeFileSync(file, content);
  console.log('Successfully replaced file upload handlers!');
} else {
  console.error('Could not find target boundaries');
}
