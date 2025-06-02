import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  username: z.string().email(),
  password: z.string().min(6)
});

type FormData = z.infer<typeof schema>;

export default function Home() {
  const [endpoint, setEndpoint] = useState("/local/login");
  const [method, setMethod] = useState("POST");
  const [response, setResponse] = useState("");
  const [collectionJson, setCollectionJson] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { username: "sudip@mocainc.com", password: "1Gre@tone1" }
  });

  const sendRequest = async (data: FormData) => {
    try {
      const res = await fetch(`https://odemo-api.airfob.com/v2${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          "moca-api-key": "tG7a+MfFvfLsUIJUkrmG69PXvQS00QhALW+HJSBBoKA="
        },
        body: method !== "GET" ? JSON.stringify(data) : undefined
      });

      const resText = await res.text();
      try {
        setResponse(JSON.stringify(JSON.parse(resText), null, 2));
      } catch {
        setResponse(resText);
      }
    } catch (err) {
      setResponse(`Error: ${err}`);
    }
  };

  const generatePostmanCollection = () => {
    const body = JSON.stringify(getValues(), null, 2);
    const collection = {
      info: {
        name: "Generated Collection",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
      },
      item: [
        {
          name: `${method} ${endpoint}`,
          request: {
            method,
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "moca-api-key", value: "{{api_key}}" }
            ],
            url: {
              raw: `{{api-address}}${endpoint}`
            },
            body: method !== "GET" ? {
              mode: "raw",
              raw: body,
              options: { raw: { language: "json" } }
            } : undefined
          }
        }
      ]
    };

    setCollectionJson(JSON.stringify(collection, null, 2));
  };

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-bold">Dynamic Request Builder</h2>
          <Input
            placeholder="Endpoint (e.g., /local/login)"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
          />
          <Input
            placeholder="Method (GET, POST, etc.)"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          />
          <form onSubmit={handleSubmit(sendRequest)} className="space-y-2">
            <Input placeholder="Username" {...register("username" as const)} />
            {errors.username && <p className="text-red-500">{errors.username.message}</p>}
            <Input placeholder="Password" type="password" {...register("password" as const)} />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            <div className="flex gap-2">
              <Button type="submit">Send Request</Button>
              <Button type="button" variant="outline" onClick={generatePostmanCollection}>Generate Postman Collection</Button>
            </div>
          </form>
          <Textarea
            rows={10}
            readOnly
            value={response}
            className="bg-gray-100"
          />
          {collectionJson && (
            <Textarea
              rows={10}
              readOnly
              value={collectionJson}
              className="bg-yellow-50"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}