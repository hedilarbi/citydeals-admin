"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { FaCloudArrowUp } from "react-icons/fa6";

const initialState = { message: null, success: false };

const CategoryCreateForm = ({
  action,
  initialValues = {},
  submitLabel = "Créer la catégorie",
  resetOnSuccess = true,
}) => {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const formRef = useRef(null);
  const [fileName, setFileName] = useState(initialValues?.coverTitle ?? "");
  const [preview, setPreview] = useState(() => ({
    url: initialValues?.coverUrl ?? "",
    isObjectUrl: false,
  }));

useEffect(() => {
  return () => {
    if (preview?.url && preview.isObjectUrl) {
      URL.revokeObjectURL(preview.url);
    }
  };
}, [preview]);

useEffect(() => {
  if (state?.success && resetOnSuccess) {
    formRef.current?.reset();
    startTransition(() => {
      setFileName("");
      setPreview((current) => {
        if (current?.url && current.isObjectUrl) {
          URL.revokeObjectURL(current.url);
        }
        return { url: "", isObjectUrl: false };
      });
    });
  }
}, [state?.success, resetOnSuccess]);

  return (
    <form
      action={formAction}
      ref={formRef}
      className="bg-white border border-light-gray rounded-3xl shadow-sm p-6 space-y-6 max-w-2xl"
    >
      <div>
        <label htmlFor="name" className="text-sm font-semibold text-gray-700">
          Nom de la catégorie *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Ex: Restaurants, Beauté..."
          defaultValue={initialValues?.name ?? ""}
          className="mt-2 w-full border border-light-gray rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pr/30"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="text-sm font-semibold text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          placeholder="Informations permettant d’identifier la catégorie..."
          defaultValue={initialValues?.description ?? ""}
          className="mt-2 w-full border border-light-gray rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pr/30 resize-none"
        />
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-700">Visuel de couverture</p>
        <label
          htmlFor="cover"
          className={`mt-2 border-2 border-dashed rounded-3xl cursor-pointer transition-colors overflow-hidden ${
            preview?.url
              ? "border-pr relative inline-flex max-w-full"
              : "flex flex-col items-center justify-center border-light-gray p-6 text-center text-sm text-gray-500 hover:border-pr"
          }`}
        >
          {preview?.url ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview.url}
                alt="Visuel sélectionné"
                className="object-contain max-w-full h-auto"
              />
              <div className="absolute inset-0 bg-black/30 text-white text-xs uppercase tracking-wide flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                Modifier l&apos;image
              </div>
            </>
          ) : (
            <>
              <FaCloudArrowUp className="text-3xl text-pr mb-2" />
              <span>
                {fileName
                  ? `Fichier sélectionné : ${fileName}`
                  : "Déposez votre visuel ou cliquez pour parcourir"}
              </span>
            </>
          )}
          <input
            id="cover"
            name="cover"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (preview?.url && preview.isObjectUrl) {
                URL.revokeObjectURL(preview.url);
              }
              if (file) {
                const objectUrl = URL.createObjectURL(file);
                setFileName(file.name);
                setPreview({
                  url: objectUrl,
                  isObjectUrl: true,
                });
              } else {
                setFileName("");
                setPreview({ url: "", isObjectUrl: false });
              }
            }}
          />
        </label>
      </div>

      {state?.message && (
        <p
          className={`text-sm rounded-2xl px-3 py-2 border ${
            state.success
              ? "text-green-700 bg-green-50 border-green-100"
              : "text-red-600 bg-red-50 border-red-100"
          }`}
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-pr text-white py-3 rounded-2xl font-medium text-sm flex items-center justify-center hover:bg-pr-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Enregistrement..." : submitLabel}
      </button>
    </form>
  );
};

export default CategoryCreateForm;
