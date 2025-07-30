import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/sections/Header";
import Footer from "@/sections/Footer";
import { Image as ImageIcon, Clock, User, Tag, FileText, Eye, Upload, Link as LinkIcon } from "lucide-react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import ImageKit from "imagekit"
import { IKContext, IKImage, IKUpload } from "imagekitio-react"
import { UploadResponse } from "imagekit/dist/libs/interfaces";
import { toast } from "react-hot-toast"; 

// Fix for "error" is of type unknown
const authenticator = async () => {
  try {
    console.log("Authenticator called, API URL:", import.meta.env.VITE_API_URL);
    const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/upload-auth`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Auth response not ok:", response.status, errorText);
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("Auth response data:", data);
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    console.error("Authenticator error:", error);
    // Fix: Type guard for error
    if (error instanceof Error) {
      throw new Error(`Authentication request failed: ${error.message}`);
    } else {
      throw new Error(`Authentication request failed: Unknown error`);
    }
  }
};

const MenuBar = ({ editor }: { editor: any }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!editor) {
    return null;
  }

 // Handle image upload with ImageKit
const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  setIsUploading(true);
  
  try {
    // First get auth parameters from your backend
    const authResponse = await axios.get(`${import.meta.env.VITE_API_URL}/posts/upload-auth`);
    const auth = authResponse.data;
    
    // Initialize ImageKit with the correct properties
    // This matches how it's initialized in your backend (post.controller.js)
    const imagekit = new ImageKit({
      publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
      urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT,
      privateKey: import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY
    });
    
    // Convert File to base64 for ImageKit upload
    const reader = new FileReader();
    
    // Create a promise to handle the FileReader asynchronously
    const fileReadPromise = new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = () => reject(reader.error);
    });
    
    reader.readAsDataURL(file);
    const base64File = await fileReadPromise;
    
    // Upload the file with base64 string
    const result = await imagekit.upload({
      file: base64File, // Using base64 string
      fileName: `editor-${Date.now()}-${file.name}`,
      folder: '/blog-images',
    });
    
    // Insert the image into the editor
    editor.chain().focus().setImage({ src: result.url }).run();
  } catch (error) {
    // Type guard for error
    if (error instanceof Error) {
      console.error("Image upload failed:", error.message);
    } else {
      console.error("Image upload failed:", error);
    }
    alert("Failed to upload image. Please try again.");
  } finally {
    setIsUploading(false);
  }
};

  // Handle direct link pasting
  const handleLinkInput = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    
    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // Add http protocol if not present
    let normalizedUrl = url;
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = 'http://' + normalizedUrl;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: normalizedUrl }).run();
  };

  return (
    <div className="border-b border-gray-200 bg-gray-50 p-2 rounded-t-md flex flex-wrap gap-1 items-center">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
        type="button"
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
        type="button"
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-gray-300' : ''}`}
        type="button"
      >
        Underline
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-gray-300' : ''}`}
        type="button"
      >
        Strike
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''}`}
        type="button"
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''}`}
        type="button"
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''}`}
        type="button"
      >
        H3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-300' : ''}`}
        type="button"
      >
        Bullet List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-300' : ''}`}
        type="button"
      >
        Ordered List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-300' : ''}`}
        type="button"
      >
        Blockquote
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''}`}
        type="button"
      >
        Left
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''}`}
        type="button"
      >
        Center
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''}`}
        type="button"
      >
        Right
      </button>
      <input
        type="color"
        onInput={(event) => {
          const target = event.target as HTMLInputElement;
          editor.chain().focus().setColor(target.value).run();
        }}
        className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        type="button"
        className="p-2 rounded hover:bg-gray-200 flex items-center gap-1"
      >
        <ImageIcon size={16} /> Image
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      <button
        onClick={handleLinkInput}
        type="button"
        className={`p-2 rounded hover:bg-gray-200 flex items-center gap-1 ${editor.isActive('link') ? 'bg-gray-300' : ''}`}
      >
        <LinkIcon size={16} /> Link
      </button>
    </div>
  );
};

const EditorContainer = ({ editor, isPreview }: { editor: any, isPreview: boolean }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="bg-white rounded-b-md border-l border-r border-b border-gray-200">
      <EditorContent 
        editor={editor} 
        className={`min-h-[300px] max-h-[500px] overflow-y-auto ${isPreview ? 'prose max-w-none p-4' : ''}`}
      />
    </div>
  );
};

const Write: React.FC = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [cover, setCover] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're editing an existing post
  const searchParams = new URLSearchParams(location.search);
  const editPostId = searchParams.get('edit');
  const isEditing = !!editPostId;

  // Debug environment variables
  console.log("ImageKit Environment Variables:", {
    publicKey: import.meta.env.VITE_IK_YOUR_IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: import.meta.env.VITE_IK_YOUR_IMAGEKIT_URL_ENDPOINT,
    hasPublicKey: !!import.meta.env.VITE_IK_YOUR_IMAGEKIT_PUBLIC_KEY,
    hasUrlEndpoint: !!import.meta.env.VITE_IK_YOUR_IMAGEKIT_URL_ENDPOINT
  });

  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>("https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80");
  const [category, setCategory] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorImage, setAuthorImage] = useState<string | null>(null);
  const [readTime, setReadTime] = useState("5");
  const [postType, setPostType] = useState("blogpost");
  const [excerpt, setExcerpt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [magazineImage, setMagazineImage] = useState<string | null>(null);
  const [isFeatured, setIsFeatured] = useState(false);

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const magazineImageRef = useRef<HTMLInputElement>(null);
  const authorImageRef = useRef<HTMLInputElement>(null);

  // Fetch post data if editing
  const { data: existingPost, isLoading: isLoadingPost } = useQuery({
    queryKey: ['post', editPostId],
    queryFn: async () => {
      if (!editPostId) return null;
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${editPostId}`);
      return response.data;
    },
    enabled: !!editPostId,
  });

  // Create the editor with drag and drop support
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        HTMLAttributes: {
          class: 'text-blue-500 underline',
        },
        autolink: true, 
        openOnClick: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'mx-auto max-h-96',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: 'Write your content here...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg focus:outline-none p-4',
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          const isImage = file.type.startsWith('image/');
          
          if (isImage) {
            const reader = new FileReader();
            reader.onload = (e) => {
              if (e.target?.result) {
                const { schema } = view.state;
                const image = schema.nodes.image.create({ src: e.target.result });
                const transaction = view.state.tr.replaceSelectionWith(image);
                view.dispatch(transaction);
              }
            };
            reader.readAsDataURL(file);
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        if (event.clipboardData && event.clipboardData.files && event.clipboardData.files[0]) {
          const file = event.clipboardData.files[0];
          const isImage = file.type.startsWith('image/');
          
          if (isImage) {
            const reader = new FileReader();
            reader.onload = (e) => {
              if (e.target?.result) {
                const { schema } = view.state;
                const image = schema.nodes.image.create({ src: e.target.result });
                const transaction = view.state.tr.replaceSelectionWith(image);
                view.dispatch(transaction);
              }
            };
            reader.readAsDataURL(file);
            return true;
          }
        }
        return false;
      },
    },
  });

  // Populate form with existing post data
  useEffect(() => {
    if (existingPost && isEditing) {
      setTitle(existingPost.title || "");
      setCoverImage(existingPost.coverImage || "");
      setCategory(existingPost.category || "");
      setAuthorName(existingPost.authorName || "");
      setAuthorImage(existingPost.authorImage || "");
      setReadTime(existingPost.readTime?.toString() || "5");
      setExcerpt(existingPost.excerpt || "");
      setIsFeatured(existingPost.isFeatured || false);
      
      // Set editor content - will be handled separately
      // if (editor && existingPost.content) {
      //   editor.commands.setContent(existingPost.content);
      // }
    }
  }, [existingPost, isEditing, editor]);

  const mutation = useMutation({
    mutationFn: async (newPost: any) => {
      const token = await getToken();
      if (isEditing && editPostId) {
        // Update existing post
        return axios.put(`${import.meta.env.VITE_API_URL}/posts/${editPostId}`, newPost, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        // Create new post
        return axios.post(`${import.meta.env.VITE_API_URL}/posts`, newPost, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      alert("Error creating post. Please try again.");
    }
  });

  const handleAuthorImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a temporary preview
      const imageUrl = URL.createObjectURL(file);
      setAuthorImage(imageUrl);
      
      // Upload to ImageKit
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          
          // Upload to ImageKit using the backend endpoint
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/posts/upload-author-image`, {
            file: {
              base64Data: base64Data.split(',')[1], // Remove data:image/...;base64, prefix
              name: file.name,
              folder: '/author-images'
            }
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${await getToken()}`
            }
          });
          
          // Update with the ImageKit URL
          setAuthorImage(response.data.url);
          toast.success("Author image uploaded successfully!");
        } catch (error) {
          console.error("Author image upload failed:", error);
          toast.error("Failed to upload author image!");
          // Revert to null if upload fails
          setAuthorImage(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMagazineImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setMagazineImage(imageUrl);
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
    }
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCoverImage(imageUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !excerpt || !category || !readTime || !authorName || !authorImage) {
      alert("Please fill all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (postType === "blogpost") {
        const content = editor?.getHTML() || '';
        
        const postData = {
          title,
          content,
          coverImage: coverImage || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
          category,
          readTime: parseInt(readTime, 10),
          excerpt,
          authorName,
          authorImage,
          isFeatured
        };
        
        const result = await mutation.mutateAsync(postData);
        
        // If successful, redirect to the post page using the slug
        if (result?.data?.slug) {
          navigate(`/blog/${result.data.slug}`);
        } else {
          navigate("/blog"); // Fallback to blog list
        }
      } else {
        // For magazine article - this would need additional server implementation
        alert("Magazine article submission is not yet implemented");
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      alert(isEditing ? "Failed to update post. Please try again." : "Failed to publish post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePreview = useCallback(() => {
    setIsPreview(!isPreview);
  }, [isPreview]);

  
  if(!isLoaded){
    return <div>Loading...</div>;
  }

  if(isLoaded && !isSignedIn) {
    return <div>You should login!</div>
  }

  return (
    <>
      <Header />
      <main className="bg-magazine-cream min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-magazine-navy mb-8">
            {isEditing ? "Edit" : "Create New"} {postType === "blogpost" ? "Blog Post" : "Magazine Article"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Post Type Selection */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setPostType("blogpost")}
                className={`px-4 py-2 rounded-md transition-colors ${
                  postType === "blogpost" 
                    ? "bg-magazine-navy text-white" 
                    : "bg-white text-magazine-navy border border-magazine-navy"
                }`}
              >
                Blog Post
              </button>
              <button
                type="button"
                onClick={() => setPostType("magazine")}
                className={`px-4 py-2 rounded-md transition-colors ${
                  postType === "magazine" 
                    ? "bg-magazine-navy text-white" 
                    : "bg-white text-magazine-navy border border-magazine-navy"
                }`}
              >
                Magazine Article
              </button>
            </div>

{/* Cover Image */}
{postType === "blogpost" && (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-lg font-medium text-magazine-navy">
      <ImageIcon size={20} /> Cover Image
    </label>
    <IKContext 
      publicKey={import.meta.env.VITE_IK_YOUR_IMAGEKIT_PUBLIC_KEY} 
      urlEndpoint={import.meta.env.VITE_IK_YOUR_IMAGEKIT_URL_ENDPOINT} 
      authenticator={authenticator}
    >
      <div className="relative h-60 bg-gray-100 rounded-md overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            className="w-full h-full object-cover"
            alt="Cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No image selected
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
          <IKUpload
            fileName="cover-image.png"
            folder="/blog-covers"
            useUniqueFileName={true}
            accept="image/*"
            onSuccess={(res: any) => {
              console.log("Upload success:", res);
              // Use the complete URL instead of just the filePath
              setCoverImage(res.url);
              toast.success("Cover image uploaded successfully!");
            }}
            onError={(err: any) => {
              console.error("Upload error:", err);
              toast.error("Image upload failed!");
            }}
            className="cursor-pointer bg-white px-4 py-2 rounded-md text-magazine-navy font-medium"
            data-label="Click to Upload Cover Image"
          />
        </div>
      </div>
    </IKContext>
  </div>
)}

            {/* Magazine Image - Only for magazine type */}
            {postType === "magazine" && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-lg font-medium text-magazine-navy">
                  <ImageIcon size={20} /> Magazine Cover Image (1365x2048)
                </label>
                <div className="relative h-96 bg-gray-100 rounded-md overflow-hidden">
                  {magazineImage ? (
                    <img 
                      src={magazineImage} 
                      alt="Magazine Cover" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                      <ImageIcon size={40} />
                      <span>Upload 1365x2048 magazine cover image</span>
                      <button
                        type="button"
                        onClick={() => magazineImageRef.current?.click()}
                        className="mt-2 bg-magazine-gold text-white px-4 py-2 rounded-md hover:bg-opacity-90"
                      >
                        <Upload size={16} className="inline mr-2" /> Upload Image
                      </button>
                    </div>
                  )}
                  <input
                    ref={magazineImageRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleMagazineImageUpload}
                  />
                </div>
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-lg font-medium text-magazine-navy">
                {postType === "blogpost" ? "Post Title" : "Magazine Title"}
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`Enter an engaging ${postType === "blogpost" ? "title" : "magazine title"}...`}
                className="w-full p-3 text-xl font-serif border-b border-magazine-gold bg-transparent focus:outline-none focus:border-magazine-navy"
                required
              />
            </div>

            {/* Excerpt / Brief Description */}
            <div className="space-y-2">
              <label htmlFor="excerpt" className="block text-lg font-medium text-magazine-navy">
                {postType === "blogpost" ? "Excerpt" : "Brief Description"}
              </label>
              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder={postType === "blogpost" 
                  ? "Write a brief summary of your post..." 
                  : "Write a brief description of your magazine..."
                }
                className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-magazine-gold"
                rows={3}
                required
              />
            </div>

            {/* Author Info Section - Only for blog posts */}
            {postType === "blogpost" && (
              <div className="space-y-4">
                <label className="block text-lg font-medium text-magazine-navy">
                  Author Information
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Author Image */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-magazine-navy">
                      <User size={16} /> Author Image
                    </label>
                    <IKContext 
                      publicKey={import.meta.env.VITE_IK_YOUR_IMAGEKIT_PUBLIC_KEY} 
                      urlEndpoint={import.meta.env.VITE_IK_YOUR_IMAGEKIT_URL_ENDPOINT} 
                      authenticator={authenticator}
                    >
                      <div className="relative w-32 h-32 bg-gray-100 rounded-md overflow-hidden">
                        {authorImage ? (
                          <img 
                            src={authorImage} 
                            alt="Author" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            <User size={32} />
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
                          <IKUpload
                            fileName="author-image.png"
                            folder="/author-images"
                            useUniqueFileName={true}
                            accept="image/*"
                            onSuccess={(res: any) => {
                              console.log("Author image upload success:", res);
                              setAuthorImage(res.url);
                              toast.success("Author image uploaded successfully!");
                            }}
                            onError={(err: any) => {
                              console.error("Author image upload error:", err);
                              toast.error("Author image upload failed!");
                            }}
                            className="cursor-pointer bg-white px-3 py-1 rounded-md text-magazine-navy text-sm font-medium"
                            data-label="Upload Author Image"
                          />
                        </div>
                      </div>
                    </IKContext>
                  </div>
                  
                  {/* Author Name */}
                  <div className="space-y-2">
                    <label htmlFor="authorName" className="flex items-center gap-2 text-sm font-medium text-magazine-navy">
                      <User size={16} /> Author Name
                    </label>
                    <input
                      id="authorName"
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Your name"
                      className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-magazine-gold"
                      required
                    />
                  </div>
                  
                  {/* Read Time */}
                  <div className="space-y-2">
                    <label htmlFor="readTime" className="flex items-center gap-2 text-sm font-medium text-magazine-navy">
                      <Clock size={16} /> Read Time (minutes)
                    </label>
                    <input
                      id="readTime"
                      type="number"
                      value={readTime}
                      onChange={(e) => setReadTime(e.target.value)}
                      min="1"
                      className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-magazine-gold"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Category - Only for blog posts */}
            {postType === "blogpost" && (
              <div className="space-y-2">
                <label htmlFor="category" className="flex items-center gap-2 text-lg font-medium text-magazine-navy">
                  <Tag size={20} /> Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-magazine-gold"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Art">Art</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Food">Food</option>
                  <option value="Photography">Photography</option>
                  <option value="Travel">Travel</option>
                  <option value="Technology">Technology</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>
              </div>
            )}

            {/* Featured Post Toggle */}
            {postType === "blogpost" && (
              <div className="flex items-center space-x-2">
                <input
                  id="isFeatured"
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4 w-4 text-magazine-gold focus:ring-magazine-gold border-gray-300 rounded"
                />
                <label htmlFor="isFeatured" className="text-sm font-medium text-magazine-navy">
                  Feature this post on homepage
                </label>
              </div>
            )}

            {/* PDF Upload - Only for magazine */}
            {postType === "magazine" && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-lg font-medium text-magazine-navy">
                  <FileText size={20} /> Magazine PDF
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
                  {pdfFile ? (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileText size={40} className="text-magazine-navy" />
                      <span className="text-lg font-medium text-magazine-navy">{pdfFile.name}</span>
                      <span className="text-sm text-gray-500">
                        {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                      <button
                        type="button"
                        onClick={() => pdfInputRef.current?.click()}
                        className="mt-2 text-magazine-gold underline"
                      >
                        Change file
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileText size={40} className="text-gray-400" />
                      <span className="text-lg font-medium text-gray-500">Upload Magazine PDF</span>
                      <span className="text-sm text-gray-400">
                        Upload the complete PDF of your magazine
                      </span>
                      <button
                        type="button"
                        onClick={() => pdfInputRef.current?.click()}
                        className="mt-2 bg-magazine-gold text-white px-4 py-2 rounded-md hover:bg-opacity-90"
                      >
                        <Upload size={16} className="inline mr-2" /> Select PDF
                      </button>
                    </div>
                  )}
                  <input
                    ref={pdfInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handlePdfUpload}
                  />
                </div>
              </div>
            )}

            {/* Rich Content Editor using TipTap - Only for blog posts */}
            {postType === "blogpost" && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="content" className="block text-lg font-medium text-magazine-navy">
                    Content
                  </label>
                  <button
                    type="button"
                    onClick={togglePreview}
                    className="flex items-center gap-1 text-magazine-navy hover:text-magazine-gold"
                  >
                    <Eye size={16} /> {isPreview ? 'Edit' : 'Preview'}
                  </button>
                </div>
                <div className="bg-white rounded-md border border-gray-200">
                  {!isPreview && <MenuBar editor={editor} />}
                  <EditorContainer editor={editor} isPreview={isPreview} />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 rounded-md bg-magazine-gold text-black font-medium hover:bg-opacity-90 transition-all ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (isEditing ? 'Updating...' : 'Publishing...') : (isEditing ? 'Update' : 'Publish')} {postType === "blogpost" ? "Post" : "Magazine"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
      
      <style>{`
        .tiptap .is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </>
  );
};

export default Write;