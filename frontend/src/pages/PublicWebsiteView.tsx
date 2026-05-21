import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import WebsiteTemplate from "../components/WebsiteTemplate";

export default function PublicWebsiteView() {
  const { id } = useParams<{ id: string }>();
  const [website, setWebsite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/websites/public/${id}`);
        console.log(res.data.website)
        setWebsite(res.data.website);
      } catch (e) {
        setError("Website not found.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return website && (
    <WebsiteTemplate
      title={website.title}
      tagline={website.tagline}
      about={website.about}
      services={website.services}
      businessName={website.businessName}
    />
  );
}